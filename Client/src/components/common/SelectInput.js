import React, {PropTypes} from 'react';


const SelectInput = ({input, name, label, defaultOption, options, labelField,placeholder,valueField,val, meta: {touched, error, warning}}) => {
    return(
        <div className="form-group">
      <div className='col-md-3'>
        <label htmlFor={name}>{label}</label>
      </div>
      <div className="field col-md-9 form-group">
                <select
                    {...input}
                    name={name}
                    placeholder = {placeholder}
                    className="form-control"
                    //value = {val}
                    value = {input.value}
                >
                 {placeholder !== undefined && <option value=''>{placeholder}</option>}
                 {/* {defaultOption !== undefined && <option>{defaultOption}</option>} */}


                    {
                        options.map(option => {
                            return <option key={option[valueField]} value={option[valueField]}>{option[labelField]}</option>;
                        })
                    }
                </select>

                    {touched && ((error && <p className="text-danger">{error}</p>) || (warning && <p className="text-danger">{warning}</p>))}
            </div>
        </div>
    );
};

SelectInput.propTypes = {
    input: PropTypes.object.isRequired,
    name: PropTypes.string,
    label: PropTypes.string.isRequired,
    defaultOption: PropTypes.string,
    labelField : PropTypes.string,
    placeholder:PropTypes.string,
    valueField : PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object),
    val : PropTypes.string,
    meta: PropTypes.object.isRequired
};

export default SelectInput;