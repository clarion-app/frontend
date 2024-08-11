import React, { useState, useRef, useEffect } from 'react';
import { UserType } from '../types';
import { useAddUserMutation } from './userApi';
import { useAppDispatch } from '../hooks';
import { setToken } from './tokenSlice';
import { setLoggedInUser } from './loggedInUserSlice';

export const NewUser: React.FC = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [addUser] = useAddUserMutation();

  // Refs for input fields
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  // Focus the input on page change
  useEffect(() => {
    switch (page) {
      case 1:
        nameInputRef.current?.focus();
        break;
      case 2:
        emailInputRef.current?.focus();
        break;
      case 3:
        passwordInputRef.current?.focus();
        break;
      case 4:
        confirmPasswordInputRef.current?.focus();
        break;
      default:
        break;
    }
  }, [page]); // Dependency on page ensures effect runs on page change

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSubmit = async () => {
    const user: Partial<UserType> = { name, email, password, c_password: confirmPassword };
    
    try {
      const result = await addUser(user);
      if (result.data?.token) {
        dispatch(setToken(result.data.token));
      }
      if (result.data?.user) {
        dispatch(setLoggedInUser({
          id: result.data.user.id,
          name: result.data.user.name,
          email: result.data.user.email,
        }));
      }
    } catch (error) {
      console.error('Error submitting user:', error);
    }
  };
  

  return (
    <div style={{ height: '100vh', width: '50vh', margin: 'auto', padding: '1%' }}>
      <h5>Page {page}</h5>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {page === 1 && (
          <div>
            <h2 className="title">Who are you?</h2>
            <input
              ref={nameInputRef}
              className="input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handlePageChange(2)}
              placeholder="Name"
            />
          </div>
        )}
        {page === 2 && (
          <div>
            <h2 className="title">What is your email address, {name}?</h2>
            <input
              ref={emailInputRef}
              className="input"
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handlePageChange(3)}
              placeholder="Email"
            />
          </div>
        )}
        {page === 3 && (
          <div>
            <h2 className="title">Choose a password</h2>
            <input
              ref={passwordInputRef}
              className="input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handlePageChange(4)}
              placeholder="Password"
            />
          </div>
        )}
        {page === 4 && (
          <div>
            <h2 className="title">Confirm your password</h2>
            <input
              ref={confirmPasswordInputRef}
              className="input"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Confirm Password"
            />
          </div>
        )}
        <div className="buttons mt-5">
          <button type="button" onClick={() => handlePageChange(page - 1)} disabled={page <= 1} className="button mr-2">Previous</button>
          {page !== 4 && <button type="button" onClick={() => handlePageChange(page + 1)} className="button">Next</button>}
          {page === 4 && <button type="submit" className="button">Submit</button>}
        </div>
      </form>
    </div>
  );
};
