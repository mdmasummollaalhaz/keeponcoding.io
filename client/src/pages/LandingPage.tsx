import React, { useState, useEffect } from 'react';
import httpClient from '../httpClient';
import { User } from '../types';
import Container from 'react-bootstrap/Container';
import Hero from '../components/landing/Hero';
import Workspace from '../components/landing/Workspace';
import Testimonial from '../components/landing/Testimonial';
import Footer from '../components/landing/Footer';

const LandingPage: React.FC = () => {
  return (
    <>
      <Hero />
      <Workspace />
      <Testimonial/>
      <Footer/>
    </>
  );
};

export default LandingPage;
