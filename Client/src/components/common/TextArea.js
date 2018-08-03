import React, {PropTypes} from 'react';

const TextArea = ({input, name, label, placeholder, meta: {touched, error, warning}}) => {
  return(
    <div className="form-group">
      <div className='col-md-3'>
        <label htmlFor={name}>{label}</label>
      </div>

      <div className="field col-md-9 form-group">
        <textarea {...input} name={name}
           // placeholder={placeholder}
            className="form-control" rows="3" cols="80"/>
        {touched && ((error && <p className="text-danger">{error}</p>) || (warning && <p className="text-danger">{warning}</p>))}
      </div>
    </div>
  );
};

TextArea.propTypes = {
    input: PropTypes.object.isRequired,
    name: PropTypes.string,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    meta: PropTypes.object.isRequired
};

export default TextArea;
