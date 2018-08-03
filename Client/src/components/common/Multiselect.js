import React, {PropTypes} from 'react';
import Dropdown from './react-dropdown-multiselect';

const Multiselect = ({input, name, label, placeholder, options, labelField, valueField, meta: {touched, error, warning}}) => {
  return(
    <div className="form-group">
        <div className='col-md-3'>
        <label htmlFor={name}>{label}</label>
    </div>

    <div className="field col-md-9 form-group">
      <Dropdown
        {...input}
        id={ input.name }
        name={input.name}
        options={options}
        labelField= {labelField}
        valueField= {valueField}
        placeholder={ placeholder }
        value = {input.value}        
      />

      {touched && ((error && <p className="text-danger">{error}</p>) || (warning && <p className="text-danger">{warning}</p>))}
    </div>
  </div>
  );
};

Multiselect.propTypes = {
    input: PropTypes.object.isRequired,
    // type: PropTypes.string.isRequired,
    name: PropTypes.string,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    options : PropTypes.array,
    labelField : PropTypes.string,
    valueField : PropTypes.string,
    // selectedValues: PropTypes.array,
    meta: PropTypes.object.isRequired
};

export default Multiselect;