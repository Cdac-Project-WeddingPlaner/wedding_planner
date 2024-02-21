//Srushti
import React, { useState, useEffect } from 'react'; import axios from 'axios';
import prof_img from './resourses/profile.jpg';
import reviewPic1 from './resourses/reviewPic1.png';
import reviewPic2 from './resourses/reviewPic2.jpg';
import reviewPic3 from './resourses/reviewPic3.jpeg';
import reviewPic4 from './resourses/reviewPic4.jpeg';

import './Homemain.css';

function Home()
{
    const [reviews, setReviews] = useState({
        plan_id:"",
        client_id:"",
        review:"",
    });

    const [vendor_images, setVendor_images] = useState({
        image_url: "",
    });

    const [token, setToken] = useState(sessionStorage.getItem('token'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:7777/vendor/2',
                    headers: {'x-auth-token': token}
                };

                const response = await axios(config);
                setReviews(response.data);
            } catch (error){
                console.error('Error fetching plan data: ', error);
            }
        };

        fetchData();

        const fetchImages = async () => {
            try {
                const config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:7777/wedding/vendor/${reviews.plan_id',
                    headers: {'x-auth-token': token}
                };

                const response = await axios(config);
                setVendor_images(response.data);
            } catch (error) {
                console.error('Error fetching images: ',error);
            }
        };
        fetchImages();
    },[token]);

    return (
        <div className='homemain'> 
            <div className="bg-picture">
                <div className="box"></div>
                <div className="intro">
                    {/* <span>Tie The Knot</span> */}
                    <span>Tie the Knot, Your Way - Let Our Virtual Wedding Planner Lead the Way!</span>
                </div>
                
            </div>
            <div className='separation'></div>
            
            <section className="first">
                <div>
                    <img src={prof_img} alt="" className="prof_img"/>
                    <p>Parineeti Chopra</p>
                </div>
                <div>
                    <span>Review: ⭐ ⭐ ⭐ ⭐ ⭐ </span>
                    <span>
                        Excellent venue and service!
                     </span>
                </div>
                <div className='secImg'>
                        <img src={reviewPic1} alt=''/>
                </div>
            </section>

            <div className='separation'></div>

            <section className='second'>
                <div className='secImg'>
                
                    <img src={reviewPic2} alt='' ></img>
                </div>
                <div >
                        <img src={prof_img} alt='' className='prof_img'></img>
                        <p>Prem Ratan</p>
                </div>
                <div>
                        <span>Review: ⭐ ⭐ ⭐ ⭐ ⭐ </span><br/>
                        <span>
                        Delicious food, great catering service!
                        </span>
                </div>
                    
            </section>

            <div className='separation'></div>

            <section className='first'>
                <div>
                
                    
                        <img src={prof_img} alt='' className='prof_img'></img>
                        <p>Sunidhi Chauhan</p>
                </div>
                <div>
                        <span>Review: ⭐ ⭐ ⭐ ⭐ ⭐ </span><br/>
                        <span>
                        Amazing musical performance, highly recommended!
                        </span>
                </div>
                <div className='secImg'>
                        <img src={reviewPic3}  alt=''/>
                </div>
                
            </section>

            <div className='separation'></div>

            <section className='second'>
                <div className='secImg'>
                    
                        <img src={reviewPic4} alt='' />
                </div>
                <div >
                        <img src={prof_img} alt='' className='prof_img'></img>
                        <p>Aman Singh</p>
                </div>
                <div>
                        <span>Review: ⭐ ⭐ ⭐ ⭐ ⭐ </span><br/>
                        <span>
                        Photography team captured our special moments beautifully.
                        </span>
                </div>
                    
                
            </section>
            <div className='separation'></div>

            <section className="about">
                <div className="us">
                    <span>Tie The Knot- Your Personal Wedding Planner</span><br/>
                    <span>Plan your wedding with us</span>
                </div>

                <div className="contact-section">
                    <span>Contact us to get best deals</span>
                    <div className="contact">
                    <div className="vendor-contact">
                        <h4>For Vendors</h4>
                        <p>Email: <a href="mailto:vendors@tietheknot.com">vendors@tietheknot.com</a></p>
                        <p>Phone: 9834688421</p>
                    </div>
                    <div className="user-contact">
                        <h4>For Users</h4>
                        <p>Email: <a href="mailto:info@tietheknot.com">info@tietheknot.com</a></p>
                        <p>Phone: 9834688421</p>
                    </div>
                    </div>
                    <div className="alerts">
                        <h4>Get Latest Alerts</h4><br/>
                        <input type="text" placeholder="Email"/>
                        
                        <button class="btn">Submit</button>
                        
                    </div>
                </div>

                <div className="social">
                    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous"/>
                    <span>Follow us on:</span>
                    <ul>
                        <li>
                            <a href="#">
                            <i class="fab fa-facebook-f icon"></i>    </a>
                        </li>
                        <li>
                            <a href="#"><i class="fab fa-twitter icon"></i></a>
                        </li>
                        <li>
                            <a href="#"><i class="fab fa-linkedin-in icon"></i></a></li>
                        <li>
                            <a href="#"><i class="fab fa-google-plus-g icon"></i></a></li>
                    </ul>
                </div>
            </section>
        </div>
        
        
        
   )        
}

export default Home;