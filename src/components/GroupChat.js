    import  { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { FaSpinner } from 'react-icons/fa';
    import '../css/GroupChat.css';
    import countries from '../data/countries';
    import states from '../data/states';
    import city from '../data/city';
    import 'react-phone-input-2/lib/style.css';
    import PhoneInput from 'react-phone-input-2';
    import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

    function GroupChat() {
  //submit create button in next page
  const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Modify handleSubmit function
  const handleSubmite = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true); // START loading spinner

      const data = {
        fullname: document.forms[0].fullname.value,
        phone,
        email: document.forms[0].email.value,
        password: document.forms[0].password.value,
        address: document.forms[0].address.value,
        country: selectedCountry,
        state: selectedStates,
        city: selectedCity,
        pcode: document.forms[0].pcode.value,
        date: document.forms[0].date.value,
        gender,
      };

      try {
      const response = await fetch('http://localhost:5000/api/users/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          alert('Signup successful');
          navigate('/home');
        } else {
          alert(result.error);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Submission failed');
      } finally {
        setIsSubmitting(false); // STOP loading spinner regardless of success/failure
      }
    }
  };


    const [selectedCountry, setSelectedCountry] = useState ('');
    const [selectedStates, setSelectedStates] = useState();
    const [selectedCity, setSelectedCity] = useState();
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const storedEmail = localStorage.getItem('userEmail');

    // gender
    const handleChange =  (event) =>{
      setGender(event.target.value)
    }

    const handleChanges = (value) => {
      setPhone(value);
    };

  //validation in a sign Up from 
    const validateForm = () => {
      const newErrors = {};
      const inputs = {
        fullname: document.forms[0].fullname.value,
        phone: phone,
        email: document.forms[0].email.value,
        password: document.forms[0].password.value,
        address: document.forms[0].address.value,
        country: selectedCountry,
        state: selectedStates,
        city: selectedCity,
        pcode: document.forms[0].pcode.value,
        date: document.forms[0].date.value,
        gender: gender
      };

      // Full Name Validation
      if (!inputs.fullname.match(/^[A-Za-z\s]{4,30}$/)) {
        newErrors.fullname = "Name must be 4-30 characters (letters only)";
      }

      // Phone Validation
      const phoneDigits = phone.replace(/\D/g,'').slice(-10);
      if (phoneDigits.length !== 10) {
        newErrors.phone = "Must be 10 digits (excluding country code)";
      }

      // Email Validation
      if (!inputs.email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
        newErrors.email = "Invalid email format";
      }

      // Password Validation
      if (!inputs.password.match(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{10}$/)) {
        newErrors.password = "Password Must have:uppercase, number, special char, 10 chars";
      }

      // Address Validation
      if (!inputs.address.trim()) {
        newErrors.address = "Address is required";
      }

      // Location Validations
      if (!selectedCountry) newErrors.country = "Country required";
      if (!selectedStates) newErrors.state = "State required";
      if (!selectedCity) newErrors.city = "City required";

      // Postal Code Validation
      if (!inputs.pcode.match(/^\d{6}$/)) {
        newErrors.pcode = "Must be 6 digits";
      }

      // Date Validation
      if (!inputs.date) {
        newErrors.date = "Date of birth required";
      }

      // Gender Validation
      if (!gender) {
        newErrors.gender = "Gender selection required";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (validateForm()) {
        // Submit logic here
        console.log("Form submitted successfully");
      }
    };

      return (
        <div className='All-GroupChat'>
          <div className="GroupChat-info">
            <h1>Sign Up</h1>
            <p>Please enter your credentials to Proceed</p>
      
            <div className="Groupchat-from">
                <form action="" method="post" onSubmit={handleSubmit}>
                  <label htmlFor="">Full Name</label><br />
                  <input type="text" name="fullname" id="fullname" placeholder='Enter Your FullName' />  <br />   
                  {errors.fullname && <div className="error">{errors.fullname}</div>}

                  <label style={{  marginBottom: '-8px'}} htmlFor="phone">Phone</label><br />
                  <PhoneInput country={'in'} value={phone} onChange={handleChanges} inputProps={{
                  name: 'phone',id: "phone",required: true,autoFocus: true}}
                  enableSearch={true}
                  /> <br />
                  {errors.phone && <div className="error">{errors.phone}</div>}

                  <label  htmlFor="">Email Address</label> <br /> 
                  <input type="email" name="email" id="email" placeholder='Enter Your Email Address' defaultValue={storedEmail}/> <br />
                  {errors.email && <div className="error">{errors.email}</div>}
                

                    <label htmlFor="password">Password</label><br />
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        id="password"
                        placeholder="Enter Your Password"
                        style={{ paddingRight: '40px' }}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-90%)',
                          cursor: 'pointer',
                          color: '#438E96',
                        }}
                      >
                        {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                      </span>
                    </div>
                    {errors.password && <div className="error">{errors.password}</div>}


                  <label style={{  marginBottom: '15px'}} htmlFor="">Address</label> <br />
                  <textarea name="address" id="address" rows="4" cols="20" placeholder="Address Line 1" ></textarea> <br />
                  {errors.address && <div className="error">{errors.address}</div>}

                  <label htmlFor="">Country</label> <br />
                  <select name="country" id="country" value={selectedCountry} onChange={(e)=>(
                    setSelectedCountry(e.target.value)
                  )} > 
                  <option value="">---select a Country---</option>
                  {countries.map((country, index)=>(
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                  </select><br />
                  {errors.country && <div className="error">{errors.country}</div>}


                  <label htmlFor="">State</label> <br />
                  <select name="state" id="state" value={selectedStates} onChange={(e)=>(
                    setSelectedStates(e.target.value)
                  )}>
                  <option value="">--select a States---</option>
                  {states.map((state, index) =>(
                    <option key={index} value={state}>
                      {state}
                      </option>
                  ))}
                  </select> <br />
                  {errors.state && <div className="error">{errors.state}</div>}


                  <label htmlFor="">City</label><br />
                <select name="country" id="country" value={selectedCity} onChange={(e)=>(
                  setSelectedCity(e.target.value)
                )}>
                  <option value="">--select a City</option>
                  {city.map((city, index)=>(
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                  </select><br />
                    {errors.city && <div className="error">{errors.city}</div>}

                  <label htmlFor="">Postal Code</label><br />
                  <input type="number" name="pcode" id="pcode" placeholder='Enter Your Postal Code' /> <br />
                  {errors.pcode && <div className="error">{errors.pcode}</div>}

                  <label  htmlFor="">My date Of birth:</label><br />
                  <input type="date" name="date" id="date"  placeholder='Enter Your date' /> <br />
                  {errors.date && <div className="error">{errors.date}</div>}
              
                    <label htmlFor="">Gender</label>
                    <div className="gender-group">
                      <label>
                        <input type="radio" name="gender" value="Male" checked={gender === 'Male'} onChange={handleChange} />
                        <span>Male</span>
                      </label>
                      <label>
                        <input type="radio" name="gender" value="Female" checked={gender === 'Female'} onChange={handleChange} />
                        <span>Female</span>
                      </label>
                      <label>
                        <input type="radio" name="gender" value="Prefer not to say" checked={gender === 'Prefer not to say'} onChange={handleChange} />
                        <span>Prefer not to say</span>
                      </label>
                    </div>
                    {errors.gender && <div className="error">{errors.gender}</div>}

                  <button type='submit' onClick={handleSubmite} disabled={isSubmitting}  className='btn-createaccount'> {isSubmitting ? (
        <div className="loading-spinner">
          <FaSpinner className="spin-icon" />
          Creating Account...
        </div>
      ) : (
        'Create Account'
      )}</button>
                </form>
            </div>
          </div>
        </div>
      );
    }

    export default GroupChat;