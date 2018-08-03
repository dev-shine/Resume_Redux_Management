import React, {PropTypes} from 'react';

const FieldInput = ({input, type, name, label, placeholder, className, disabled, autoFocus, meta: {touched, error, warning}}) => {
  return(
    <div className={className}>
      <div className='col-md-3'>
      <label htmlFor={name}>{label}</label>
    </div>

    <div className="field col-md-9 form-group">
      <input
          {...input}
          type={type}
          name={name}
          className="form-control"
          disabled={ disabled }
          autoFocus={ autoFocus ? autoFocus : false }
          // placeholder={placeholder}
      />

      {touched && ((error && <p className="text-danger">{error}</p>) || (warning && <p className="text-danger">{warning}</p>))}
    </div>
    </div>
  );
};

FieldInput.propTypes = {
    input: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    meta: PropTypes.object.isRequired,
};

export default FieldInput;