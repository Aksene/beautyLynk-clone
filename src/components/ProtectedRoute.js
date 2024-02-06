import { useAuth2 } from "../Auth/auth2";
import { Navigate } from "react-router-dom";
import { useLocation } from 'react-router-dom'


const ProtectedRoute = ({children}) => {
        // Call custom useAuth hook
        const auth = useAuth2()
        let location = useLocation();
        const search = useLocation().search;
        const id=new URLSearchParams(search).get("id");

        // If user is logged in then direct the user to the page
        // If not then direct them to the sign in page using Navigate
        if(auth.session){
              return children  
        }else {
                if(location.pathname.includes("/booking-confirmation")) {
                        localStorage.setItem('prevURL', JSON.stringify(`${location.pathname}?id=${id}`));
                        return <Navigate to ={"/login"}/>

                }else {
                        return <Navigate to ={"/login"}/>
                }
        }
        // return auth.session ? children : <Navigate to ={"/login"}/>
}

export default ProtectedRoute;
