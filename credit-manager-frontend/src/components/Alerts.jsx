import React from "react";
import {Alert} from "@mui/material";

function Alerts({message,type}){

    return(
        
        <Alert severity={type}
               style={{
                    zIndex:1000,
                    position:'absolute',
                    top:0,
                    right:0,
               }}
        >
            {message}
        </Alert>
        
    );
}

export default Alerts;