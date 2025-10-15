import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'

function Adlist({token}) {
  const [list, setList] = useState([])
const fetchAdlist = async () => {
    try {
      const res = await axios.get(backendUrl+'/api/ads/list')
      if(res.data.success){
        setList(res.data.ads)
      }
    }catch(error){
      console.log(error);
  }
}
const removeProduct = async (id) => {
  try {
    alert("Ad removed successfully1")
    const res = await axios.post(backendUrl+'/api/ads/remove',{id},{headers:{token}})
    alert("Ad removed successfully2")
    if(res.data.success){
      // toast.success(res.data.message)
      // setList(res.data.ad)
      await fetchAdlist()
      alert("Ad removed successfully")
    } else {
      // toast.error(res.data.message)
    } 
  } catch (error) {
    console.log(error);
    // toast.error(error.message)
  } 
}

useEffect(()=>{
  fetchAdlist()
})
  return (
    <div>
        <div className='flex flex-col gap-2'>
                {/* List Table Title  */}
                <div className='hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
                  <b>Image</b>
                  <b>title</b>
                  <b>adslocation</b>
                  {/* <b>isactive</b> */}
                  <b>link</b>
                  <b>description</b>
                  <b className='text-center'>Action</b>
                </div>
        
                {/* Product List  */}
                {
                  list.map((item, index) => (
                    <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index} >
                      <img className='w-12' src={item.imageUrl} alt="" />
                      <p>{item.title}</p>
                      <p>{item.adslocation}</p>
                      <p>{item.link}</p>
                      <p>{item.description}</p>
                      <p onClick={()=>removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
                    </div>
                  ))
                }
              </div>
    </div>
  )
}

export default Adlist;