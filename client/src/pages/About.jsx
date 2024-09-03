import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { CallToAction } from '@/components/CallToAction';

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center flex-col gap-6 p-4'>
      <h1 className='text-3xl font-semibold text-center'>About CapuchinoJT's Blog</h1>
      <div className='max-w-2xl text-left'>
        <p className='mb-4 text-gray-500'>
          CapuchinoJT's Blog is a platform dedicated to sharing knowledge and insights about web development, 
          with a focus on JavaScript, React.js, and Next.js. Our goal is to provide valuable content for developers 
          of all skill levels, from beginners to advanced practitioners.
        </p>
        <p className='mb-4 text-gray-500'>
          This blog is built using the MERN stack (MongoDB, Express, React, Node.js) and incorporates modern web 
          development practices and tools. It serves as both a learning resource and a demonstration of full-stack 
          development capabilities.
        </p>
        <p className='mb-4 text-gray-500'>
          Whether you're here to learn, share, or connect with fellow developers, we hope you find our content 
          helpful and inspiring.
        </p>
      </div>
      <Button gradientDuoTone='purpleToPink'>
        <Link to='/search'>Explore Posts</Link>
      </Button>
      <div className='w-full'>
        <CallToAction />
      </div>
    </div>
  );
}
