import React from 'react';

export const Roles = ({ roles, onRoleClick }) => {
  return (
    <ul id="RoleList" className="list-group checked-list-box">
    {
        roles.map((role, index) => (
          <li key={ role._id } className="list-group-item roleDetails list-group-item-primary liStyle" id={ role._id }>
            <input type="checkbox" id={ role._id } checked={ role.isSelected } className="marginRight" onChange={ (e) => onRoleClick(e) } />
            { role.RoleName }
          </li>
        ))
    }
    </ul>
  );
};

export default Roles;