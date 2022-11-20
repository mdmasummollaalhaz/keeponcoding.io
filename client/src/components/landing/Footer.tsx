import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faHeart } from '@fortawesome/free-solid-svg-icons';
import facebook from '../../../src/media/img/footer/facebook.svg'
import apple from '../../../src/media/img/footer/apple.svg'
import uber from '../../../src/media/img/footer/uber.svg'
import cisco from '../../../src/media/img/footer/cisco.svg'
import leapMotion from '../../../src/media/img/footer/leap-motion.svg'
import squarespace from '../../../src/media/img/footer/squarespace.svg'
import intel from '../../../src/media/img/footer/intel.svg'
import amazon from '../../../src/media/img/footer/amazon.svg'
import bankofamarica from '../../../src/media/img/footer/bank-of-america.svg'
import pinterest from '../../../src/media/img/footer/pinterest.svg'
import stripe from '../../../src/media/img/footer/stripe.svg'
import './footer.scss'

const Footer: React.FC = () => {
    return (
        <div className='footer-section'>
            <div className="container">
                {/* First Part  */}
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="text-center">Made with <FontAwesomeIcon icon={faHeart} />  in SF</h1>

                        <p className='w-50 mx-auto text-center'>At LeetCode, our mission is to help you improve yourself and land your dream job. We have a sizable repository of interview resources for many companies. In the past few years, our users have landed jobs at top companies around the world.</p>

                    </div>
                </div>
                {/* Second Part Which is Image */}
                <div className="row">
                    <div className="col-md-12">
                        <div className='d-flex flex-wrap justify-content-center'>
                            <img src={facebook} alt="" className='img-custom' />
                            <img src={apple} alt="" className='img-custom' />
                            <img src={uber} alt="" className='img-custom' />
                            <img src={squarespace} alt="" className='img-custom' />
                            <img src={leapMotion} alt="" className='img-custom' />
                            <img src={intel} alt="" className='img-custom' />
                            <img src={amazon} alt="" className='img-custom' />
                        </div>
                        <div className='d-flex flex-wrap justify-content-center'>
                            <img src={bankofamarica} alt="" className='img-custom' />
                            <img src={pinterest} alt="" className='img-custom' />
                            <img src={cisco} alt="" className='img-custom' />
                            <img src={stripe} alt="" className='img-custom' />
                        </div>
                    </div>

                    <div className="col-md-12">

                    </div>
                </div>

                {/* Third Part */}
                <div className="row">
                    <div className="col-md-12">
                        <hr className='w-50 mx-auto text-center' />
                        <p className='w-50 mx-auto text-center'>If you are passionate about tackling some of the most interesting problems around, we would love to hear from you.</p>

                        <div className='text-center'>
                            <Link to='#' className='text-decoration-none'>Join Our Team <FontAwesomeIcon icon={faArrowLeftLong} /> </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="row footer-bottom-section">
                    <div className="col-md-6">
                        <p>Copyright © 2022 Keep On Codding</p>
                    </div>
                    <div className="col-md-6 me-auto">
                        <ul className='bottom-footer-menu'>
                            <li><Link to='#'> Help Center</Link></li>
                            <li><Link to='#'> Jobs</Link></li>
                            <li><Link to='#'> Bug Bounty</Link></li>
                            <li><Link to='#'> Students</Link></li>
                            <li><Link to='#'> Terms</Link></li>
                            <li><Link to='#'> Privecy</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer 