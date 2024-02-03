import LoginLink from '@/components/LoginLink';
import Logout from '@/components/Logout';
import RegisterLink from '@/components/RegisterLink';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { checkIfUserLoggedIn } from '@/lib/actions/actions';
import { Github } from 'lucide-react';

import Link from 'next/link';
import RegisterDialog from './registerDialog';

export function Register() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Form</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[475px]'>
        <DialogHeader>
          <DialogTitle>Register</DialogTitle>
          <DialogDescription className='mt-2'>
            For full access and a seamless experience on this application,
            Please take a moment to register.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' placeholder='abc@gamil.com' type='email' />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='password'>Password</Label>
          <Input id='password' type='password' />
        </div>
        <DialogFooter>
          <Button type='submit'>Register</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default async function Home() {
  const isUserLoggedIn = await checkIfUserLoggedIn();
  return (
    <>
      <div className='border-b'>
        <div className='flex h-16 items-center px-32'>
          <h4 className='font-bold text-xl tracking-tight cursor-pointer '>
            SimpleForms
          </h4>
          <div className='ml-auto flex items-center space-x-4 text-sm font-medium'>
            {!isUserLoggedIn && <LoginLink />}
            {!isUserLoggedIn && <RegisterLink />}
            {isUserLoggedIn && <Logout />}
            <span className='text-slate-700 text-sm cursor-pointer'>
              Give us a support
            </span>
            <Github
              className='cursor-pointer'
              color='#000000'
              strokeWidth={1.75}
              size={18}
              fill='true'
            />
          </div>
        </div>
      </div>

      <section className='mt-12 px-32'>
        <div className=''>
          <h1 className='text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1'>
            Build Beautiful Forms
          </h1>
          <h1 className='text-2xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1'>
            And Own Your Data
          </h1>
        </div>
        <div className='mt-8'>
          <div className='max-w-[750px] text-lg text-muted-foreground ms:text-xl'>
            Publish your form in very quick span of time
          </div>
        </div>
        <div className=' mt-4 flex w-full items-center space-x-4 pb-8 pt-4 md:pb-10'>
          {isUserLoggedIn ? (
            <Link href={'/forms'}>
              <Button className=''>Create Form</Button>
            </Link>
          ) : (
            <RegisterDialog />
          )}
        </div>
      </section>

      <div className='px-32 mt-8'>
        <div className='mb-4 flex items-center'>
          <div className='font-bold flex items-center pr-8 cursor-pointer'>
            Dashboard
          </div>
          <div className='flex items-center px-8 font-medium text-muted-foreground cursor-pointer'>
            Editor
          </div>
          <div className='flex items-center px-8 font-medium text-muted-foreground cursor-pointer'>
            Responses
          </div>
        </div>
      </div>
    </>
  );
}
