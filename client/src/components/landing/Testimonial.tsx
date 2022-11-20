import { Col, Container, Row } from 'react-bootstrap';
// Company Logos 
import googleLogo from '../../media/img/testimonial/company-logo/google.png';
import amazonLogo from '../../media/img/testimonial/company-logo/amazon.png';
import microsoftLogo from '../../media/img/testimonial/company-logo/microsoft.png';
import oracleLogo from '../../media/img/testimonial/company-logo/oracle.png';
import palantirLogo from '../../media/img/testimonial/company-logo/palantir.png';
import zillowLogo from '../../media/img/testimonial/company-logo/zillow.png';
import harvardLogo from '../../media/img/testimonial/company-logo/harvard.png';

// User logo
import imageOne from '../../media/img/testimonial/user-img/firstUser.jpg';
import secondUser from '../../media/img/testimonial/user-img/secondUser.jpeg';
import thirdUser from '../../media/img/testimonial/user-img/thirdUser.jpg';
import fourUser from '../../media/img/testimonial/user-img/fourUser.jpg';
import fiveUser from '../../media/img/testimonial/user-img/fiveUser.jpg';
import sixUser from '../../media/img/testimonial/user-img/sixUser.jpg';
import sevenUser from '../../media/img/testimonial/user-img/sevenUser.jpg';

import { useEffect, useState } from 'react';
import apiData from './fackData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong, faRightLong } from '@fortawesome/free-solid-svg-icons';

const Testimonial: React.FC = () => {
  // const [ data, setData ] = useState< {id : number, name: string, designation: string, userImg: string, feedback: string}[] >([])

  // useEffect( ()=>{
  //   apiData( ).then( data => setData( data ))
  // },[])

  const data = [
    {
      "id": 1,
      "name": "Alex",
      "designation": "Software Engineer",
      "userImage": imageOne,
      "companyLogo" : googleLogo,
      "feedback": "AlgoExpert was the backbone of my technical coding interview preparation. It allows you to efficiently work through the most common variations of problems asked by top-tier companies without having to spend hours 'battling' an algorithm only to come up with an inefficient or incorrect solution. There are a lot of resources available for repetition, but AlgoExpert differentiates its product by providing the 'how' and 'why' in clear and concise videos. Developing a deeper understanding of how to approach these problems is better than trying to memorize lines of code. I highly recommend AlgoExpert."
    },
    {
      "id": 2,
      "name": "Noman",
      "designation": "Sr. Software Engineer",
      "userImage": secondUser,
      "companyLogo" : amazonLogo,
      "feedback": "As a scientist who was looking to break into Tech, I knew the underlying logic of programming, but I had a lot of gaps in my understanding, especially on the types of algorithms questions asked at interviews. I can confidently say that AlgoExpert is one of the best resources out there for interview preparation, with fantastic video tutorials and an excellent question selection that allows you to get a deep understanding of the topics and confidence in your problem solving ability. The site is incredibly intuitive to use and I think that the staff are some of the best out there, being incredibly supportive and passionate about offering a great customer experience. I cannot recommend AlgoExpert highly enough."
    },
    {
      "id": 3,
      "name": "Munna",
      "designation": "Manager",
      "userImage": thirdUser,
      "companyLogo" : harvardLogo,
      "feedback": "I'm just writing to thank you for this product. I had failed in so many interviews before, but I wanted to get into a top tech company so much that I even enrolled in a Master's program. Even then, I was unsure if I had what it takes to make it. From the moment I heard your first video explanation, I thought 'this is exactly the way to solve an interview question' (plus the extra points you can grab by asking clarifying questions). After a few months of studying, mainly on AlgoExpert, I got offers to intern at Microsoft and Google!"
    },
    {
      "id": 4,
      "name": "Maruf",
      "designation": "Graphic Designerer",
      "userImage": fourUser,
      "companyLogo" : microsoftLogo,
      "feedback": "I just accepted an offer with Palantir, and also received an offer from Amazon and a handful of startups. AlgoExpert does a great job selecting problems- many of my interview questions were variants of problems on the website. And when I came across problems I hadn't seen before, AlgoExpert gave me the tools to select the right data structures and identify patterns. Thanks AlgoExpert!"
    },
    {
      "id": 5,
      "name": "kayes",
      "designation": "Matching Larninger",
      "userImage": fiveUser,
      "companyLogo" : oracleLogo,
      "feedback": "I just got a job offer from Oracle and most of the questions they asked, I had practiced on AlgoExpert. Even when they asked questions I was not familiar with, I was able to break down the problem and write code which I learned from the explanations section on AlgoExpert. Being a Computer Science Engineering student, I had fundamental knowledge in Data Structures & Algorithms, but I didn't know how to approach, break down and apply this knowledge to solve problems. Also since all the problems are classified into categories, I was able to easily identify my weak points and work on those. Extremely grateful to AlgoExpert !"
    },
    {
      "id": 6,
      "name": "Masum",
      "designation": "Meta Eng Facebooker",
      "userImage": sixUser,
      "companyLogo" : zillowLogo,
      "feedback": "The video explanations and detailed code examples on AlgoExpert have changed the way I approach coding problems. It has been an incredible asset during my career journey and I highly recommend it to anyone preparing for the job market."
    },
    {
      "id": 7,
      "name": "Sree Piya",
      "designation": "VFX Creator",
      "userImage": sevenUser,
      "companyLogo" : palantirLogo,
      "feedback": "I've done Udemy, Udacity, Interview Cake, Educative, Egghead, Pluralsight, MIT OpenCourseWare, LeetCode, CodeSignal and various Youtube courses but this stuff that you all are putting out is among the best. Great work!"
    }
  ]

  const [ start, setStart ] = useState(0)
  const [ end, setEnd ] = useState(3)
  const plusButton = () =>{
    if( end < data.length ){
      setStart( start + 1 )
      setEnd( end + 1 )
    }
  }
  const minusButton = () =>{
      if( end > 0 && start > 0 ){
        setStart( start - 1 )
        setEnd( end - 1 )
      }
  }
  console.log( 'start',start, end,'end' )
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-12'>
          <h1 className="text-center py-5">
            And Over 140,000 Satisfied Engineers.
          </h1>
        </div>
      </div>
      <div className='row'>
          {
            data.slice(start,end).map(( topic, index ) => {return (
              <div key={index} className="col-md-4">
                <div className='text-center'>
                  <img src={topic.userImage} alt="" className='rounded-circle'/>
                  <p>{topic.name}</p>
                  <p>{topic.designation}</p>
                  <img src={topic.companyLogo} alt="" />
                </div>
                  <p>
                      {topic.feedback}
                    </p>
              </div>
            )})
          }
          
      </div>
          <div className='text-center py-5'> 
            <button onClick={ minusButton } className="me-4" > <FontAwesomeIcon icon={faLeftLong} /> </button>  
            <button onClick={ plusButton } className="ms-4" > <FontAwesomeIcon icon={faRightLong} /> </button>
          </div>
    </div>
  );
};

export default Testimonial;
