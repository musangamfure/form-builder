import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RocketIcon } from '@radix-ui/react-icons';

function Page() {
  return (
    <div className='my-28 mx-28'>
      <Alert>
        <RocketIcon className='h-4 w-4' />
        <AlertTitle>Submission Successful</AlertTitle>
        <AlertDescription>
          Your form has been Successfully submitted. Thank you for your time!.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default Page;
