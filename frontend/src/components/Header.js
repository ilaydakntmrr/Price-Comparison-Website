import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHome, faHeadset, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import LogoImage from '../Pictures/logo.jpeg';

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  padding: 10px 40px;
  height: 80px; /* Increased height */
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  width: 120px; 
  height: 110px;
  border-radius: 10px; 
`;

const LogoText = styled(Link)`
  margin-left: 10px; 
  font-size: 3rem; 
  font-weight: bold;
  color: #053262; 
  font-family: 'Courier New';
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
  color: #18191a;
  padding: 10px;

  &:hover {
    background-color: #3d4042;
    color: #ffffff;
    padding: 10px;
    border-radius: 5px;
  }
`;

const Dropdown = styled.div`
  position: relative;

  &:hover {
    ${NavLink} {
      background-color: #3d4042;
      color: #ffffff;
      padding: 10px;
      border-radius: 5px;
    }
  }
`;

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  background-color: #fff;
  min-width: 130px;
  border: 1px solid #ddd;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
  top: calc(100% + 10px);
  left: 0;
  border-radius: 8px;

  ${Dropdown}:hover & {
    display: block;
  }
`;

const DropdownLink = styled(Link)`
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s ease;
  font-size: 13px;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #ccc;
  margin-top: 10px;
`;

const Header = ({ onLogout }) => {
  return (
    <div>
      <NavBar>
        <LogoContainer>
          <Link to="/">
            <Logo src={LogoImage} alt="Logo" />
          </Link>
          <LogoText to="/">Bakkal</LogoText>
        </LogoContainer>
        <NavLinks>
          <NavLink to="/"> <FontAwesomeIcon icon={faHome} />  Anasayfa</NavLink>
          <NavLink to="/SupportForm"><FontAwesomeIcon icon={faHeadset}/> Destek</NavLink>
          <Dropdown>
            <NavLink to="#">
              <FontAwesomeIcon icon={faUser} /> Hesabım
            </NavLink>
            <DropdownContent>
              <DropdownLink to="/account-settings">Hesap Ayarlarım</DropdownLink>
              <DropdownLink onClick={onLogout} to="">
                <FontAwesomeIcon icon={faSignOutAlt} /> Çıkış Yap
              </DropdownLink>
            </DropdownContent>
          </Dropdown>
        </NavLinks>
      </NavBar>
      <Divider />
    </div>
  );
};

export default Header;
