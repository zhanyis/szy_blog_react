import '../static/style/components/cover.css';
import {useContext} from 'react';
import ThemeContext from '../static/jsMethod/context';

const Cover = () => {
    const theme = useContext(ThemeContext)
    return (
        <div className={`outercontainer-cover ${theme.state.dark ? 'app-dark' : 'app-light'}`}>
            {/* <div className="c" >
                <span className="c-person">(／‵Д′)／</span>~ <span className="c-table">╧╧</span>

            </div> */}
            <div className="container">
                <div className="guy">
                    <div className="eye"></div>
                    <div className="eye"></div>
                    <div className="mouth"></div>
                    <div className="arm"></div>
                    <div className="arm"></div>
                </div>
                <div className="trajectory">
                    <div className="curtain"></div>
                </div>
                <div className="table">
                    <div className="legs"></div>
                </div>
            </div>
        </div>
    )
}

export default Cover