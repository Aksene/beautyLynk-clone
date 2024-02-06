import { Session, User } from '@supabase/supabase-js';
import { useContext, useState, useEffect, createContext } from 'react';
import { supabase } from '../database/Database';

// create a context for authentication
const AuthContext = createContext({ session: null, user: null, signOut: () => {} });

export const AuthProvider2 = ({ children }) => {
    const [user, setUser] = useState()
    const [session, setSession] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const setData = async () => {
            const { data: { session, user }, error } = await supabase.auth.getSession();
            if (error) throw error;

            if (session){
                setSession(session)
                setUser(session.user)
                setLoading(false);
            }else{
                setSession(null)
                setUser(null)
                setLoading(false);
            }
        };

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if(_event === 'SIGNED_IN'){
                console.log("Event: " + _event)
                setSession(session)
                setUser(session.user)
                setLoading(false)
            }

            if(_event === "SIGNED_OUT"){
                setUser(null)
                setLoading(false)

            }
            
        });

        
        

        setData();

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const Login = async (email, password) => {
        const {error, user} = await supabase.auth.signInWithPassword({
            email: email, 
            password: password,
        })

        if(error) {
            console.log(error)
        }

        return {error, user}

    }

    const Register = async (email, password) => {
        const {error, user} = await supabase.auth.signUp({
            email: email, 
            password: password,
        })

        if(error) {
            console.log(error)
        }

        return {error, user}

    }

    const Logout = async () => {
        const {error} = await supabase.auth.signOut()

        if(error) {
            console.log(error)
        }

        setUser(null)
        

    }

    const value = {
        session,
        user,
        Login,
        Register,
        Logout
        // signOut: () => supabase.auth.signOut(),
    };

    // use a provider to pass down the value
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// export the useAuth hook
export const useAuth2 = () => {
    return useContext(AuthContext);
};