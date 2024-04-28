import './Scan.css'
import React, {useState} from 'react'


const Scan = () =>
{
    const [image, setImage] = useState('');
    
    const capture = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt: ProgressEvent<FileReader>) {
                setImage(evt.target!.result as string);
            };
            reader.readAsDataURL(file);
        }
    } 

    return(
    <>
        <div className='scanctr'>
            <input
                type = "file"
                accept = "image/*"
                capture = "environment"
                onChange = {capture}
                className = 'feed'
            />
            {image && <img src={image} alt="Captured" style={{ width: '100%', height: 'auto' }} />}
        </div>
    </>
    );
}


export default Scan