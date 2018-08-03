import React, {PropTypes} from 'react';


const CheckboxInput = ({input, type, name, label, checked, meta: {touched, error, warning}}) => {
var check = 'true';
  if(input.value !== "")
  {
    return(
            <div className="form-group">
                <div className='col-md-3'>
                <label htmlFor={name}>{label}</label>
              </div>

                <div className="field col-md-9 form-group">

                    <input
                        {...input}
                        type={type}
                        name={name}
                    />
                    {touched && ((error && <p className="text-danger">{error}</p>) || (warning && <p className="text-danger">{warning}</p>))}
                </div>
            </div>
    );
  }
  else {
    return(
            <div className="form-group">
              <div className='col-md-3'>
                <label htmlFor={name}>{label}</label>
              </div>
                <div className="field col-md-9 form-group">

                    <input
                        {...input}
                        type={type}
                        name={name}
                        checked = {check}
                        value = {check}
                    />
                    {touched && ((error && <p className="text-danger">{error}</p>) || (warning && <p className="text-danger">{warning}</p>))}
                </div>
            </div>
    );
  }


};



CheckboxInput.propTypes = {
    input: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string,
    label: PropTypes.string.isRequired,
    meta: PropTypes.object.isRequired,
};



export default CheckboxInput;
