import React, { useState } from 'react'
import { assets } from '../assets/admin_assets/assets'
import axios from 'axios'
import { backendUrl } from '../App.jsx';

function Adsadd({ token }) {
    const [image1, setImage1] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("After_Nav")
    const [link,setLink] = useState("");
    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try{
            const formData = new FormData()
            formData.append("title", title)
            formData.append("description", description)
            formData.append("category", category)
            formData.append("link", link)
            image1 && formData.append("image1", image1)

            const response = await axios.post(backendUrl + "/api/ads/create", formData, {headers:{token}})
            if (response.data.success) {
                alert(response.data.message)
                setTitle('')
                setDescription('')
                setImage1(false)
            } else {
                alert(response.data.message)
            }
        }catch(error){
            console.log(error);
            alert(error.message)
        }
            
        // const res = axios.post(backendUrl+'/api/ads/create',{image1,title,description,category,link},{headers:{token:{token}}});
        // console.log(backendUrl,res);
    }

  return (
     <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
                <div>
                    <p className='mb-2'>Upload Image</p>
    
                    <div className="flex gap-2">
                        <label htmlFor='image1'>
                            <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
                            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id='image1' hidden />
                        </label>
                        
                    </div>
                </div>
    
                <div className='w-full'>
                    <p className='mb-2'>Title</p>
                    <input onChange={(e) => setTitle(e.target.value)} value={title} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
                </div>
    
                <div className='w-full'>
                    <p className='mb-2'>Ads Description</p>
                    <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' placeholder='Write content here' required />
                </div>
    
                <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
                    <div>
                        <p className='mb-2'>Product category</p>
                        <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
                            <option value="After_Nav">After_Nav</option>
                            <option value="Bottom">Bottom</option>
                            {/* <option value="Kids">Kids</option> */}
                        </select>
                    </div>
                </div>
                <div className='w-full'>
                    <p className='mb-2'>Link</p>
                    <textarea onChange={(e) => setLink(e.target.value)} value={link} className='w-full max-w-[500px] px-3 py-2' placeholder='Write content here' required />
                </div>
    
                <button type='submit' className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>
    
            </form>
        );
  
}

export default Adsadd