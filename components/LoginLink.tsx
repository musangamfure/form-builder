'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';

function LoginLink() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormValues({ email: '', password: '' });

    try {
      setLoading(false);
      const resSignIn = await signIn('credentials', {
        redirect: false,
        email: formValues.email,
        password: formValues.password,
        callbackUrl: '/forms',
      });

      if (!resSignIn?.error) {
        router.push('/forms');
      } else {
        setError('invalid email or password');
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='transition-colors hover:text-foreground/80 text-foreground/50 cursor-pointer'>
          Log In
        </div>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[475px]'>
        <DialogHeader>
          <DialogTitle>Log In</DialogTitle>

          <DialogDescription>
            Log In forn full access and a seamless experience on this Platform.
          </DialogDescription>
        </DialogHeader>
        <div className=''>
          <form className='py-2' onSubmit={onSubmit}>
            {error && <p className='py-2 rounded '> {error}</p>}
            <div className='grid gap-2 mt-3'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                name='email'
                placeholder='abc@gamil.com'
                value={formValues.email}
                onChange={handleChange}
              />
            </div>

            <div className='gird gap-2 mt-3'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                name='password'
                value={formValues.password}
                onChange={handleChange}
              />

              <DialogFooter>
                <Button className='mt-5' type='submit'>
                  Log In
                </Button>
              </DialogFooter>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LoginLink;
