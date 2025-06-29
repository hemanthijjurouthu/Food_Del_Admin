import React, { useState,useEffect } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = ({url}) => {

  const [image,setImage] = useState(false);
  const [data,setData] = useState({
    name:"",
    description:"",
    price:"",
    category:"Salad"
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({...data,[name]:value}));
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "First_time_using_cloudinary");
    formData.append("cloud_name", "demm0gqzw");
  
    try {
      const cloudinaryRes = await fetch(
        "https://api.cloudinary.com/v1_1/demm0gqzw/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
  
      const uploadedImage = await cloudinaryRes.json();
      const imageUrl = uploadedImage.url;
  
      console.log("Image uploaded to Cloudinary:", imageUrl);
  
      const response = await axios.post(`${url}/api/food/add`, {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        image: imageUrl,
      });
  
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad",
        });
        setImage(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Upload or submission failed", err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden required/>
        </div>
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder="Type here" />
        </div>
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder="Write Content Here"/>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select onChange={onChangeHandler} name="category">
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product price</p>
            <input onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder="$20"/>
          </div>
        </div>
        <button type="submit" className='add-btn'>ADD</button>
      </form>
    </div>
  )
}

export default Add