import { useState } from 'react'
import './App.css'

function App() {

  type Department = {
    index: number,
    father: number | undefined,
    children: Array<number>,
    booked: boolean,
  }

  const initialDepartments: Department[] = [
    {
      index: 0,
      father: undefined,
      children: [1, 2],
      booked: false,
    },
    {
      index: 1,
      father: 0,
      children: [3],
      booked: false,
    },
    {
      index: 2,
      father: 0,
      children: [],
      booked: false,
    },
    {
      index: 3,
      father: 1,
      children: [],
      booked: false,
    },
  ]

  const [departments, setDepartments] = useState<Department[]>(initialDepartments)

  const book = (index: number) => {
    setDepartments((prevDepartments) => {
      if(ableToBook(index)) {
        const currentDepartments = prevDepartments.map((dept) => ({
          ...dept,
          booked: dept.index === index ? !dept.booked : dept.booked,
        }));
        return currentDepartments;
      }
      return prevDepartments
    })
  }

  const findDepartment = (index: number) => departments.find(department => department.index === index);

  const ableToBook = (index: number) => {
    const departmentFinded = findDepartment(index);
    const parent = departmentFinded?.father;
    const children = departmentFinded?.children
    const validateParent = parent !== undefined ? parentIsBooked(parent) : false;
    const validateChildren = children ? childrenIsBooked(children) : false;
    return !(validateParent || validateChildren)
  }

  const parentIsBooked = (index: number): boolean => {
    
      const parent = departments.find(department => department.index === index);
      
      if(!parent) {
        return false
      }

      if(parent?.booked) {
        return true
      }

      if(parent?.father !== undefined) {
        return parentIsBooked(parent.father)
      }
    
    return false
  }

  const notRecursiveParentIsBooked = (index: number) => {
    const stack = [index];

    while(stack.length > 0){
      const currentIndex = stack.pop();
      const parent = departments.find(department => department.index === currentIndex);
      
      if(parent?.booked) {
        return true
      }

      if(parent?.father !== undefined) {
        stack.push(parent.father)
      }
    }

    return false
  }

  const childrenIsBooked = (children: Array<number> | undefined): boolean => {
    if(!children) {
      return false
    }
    return children?.some(child => {
      const departmentsFinded = departments.find(department => department.index === child);
      if(departmentsFinded?.booked){
        return true
      }
      if(childrenIsBooked(departmentsFinded?.children)){
        return true
      }
      return false;
    })
  }

  const departmentsList = departments.map(department => <button disabled={!ableToBook(department.index)} onClick={() => book(department.index)} key={department.index}>Department {department.index} {department.booked? 'booked' : 'available'}</button>)

  return (
    <div className='container'>
      {departmentsList}
    </div>
  )
}

export default App
