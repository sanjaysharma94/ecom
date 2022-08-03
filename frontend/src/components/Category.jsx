
import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom"

export default function Category() {
    const [category , setCategory] = React.useState([])

    useEffect(()=>{
            axios.get("http://localhost:8080/prodcategory").then((res)=>setCategory(res.data))
    },[])

  return (
    <ImageList sx={{ width: 1250, height: 550 }} cols={4} rowHeight={270}>
      {category.map((item) => (
        <ImageListItem key={item.img}>
          <img
            src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
            srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=7 5x`}
            alt={item.category}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}