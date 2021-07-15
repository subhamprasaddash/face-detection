import React from 'react'
import './ImageLinkForm.css'

const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {
    return (
        <div>
            <p className='f4'>
                {
                    'This Web Application detects faces in your images using AI. Give it a try :) !!!'
                }
            </p>
            <div>
                <div className = 'form center pa4 br3 shadow-5'>
                <input className='f4 pa2 w-70 center' type='text' onChange={onInputChange} />
                    <button className='btn-grad w-30'
                    onClick = {onButtonSubmit} >Detect</button>
                </div>
            </div>
        </div>
    )
}

export default ImageLinkForm

