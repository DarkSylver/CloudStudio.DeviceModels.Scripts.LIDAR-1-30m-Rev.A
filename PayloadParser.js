function parseUplink(device, payload)
{
    // Obtener payload como JSON
    const jsonPayload = payload.asJsonObject();

    // No se puede deserializar el payload como json, salir.
    if (!jsonPayload) { return; }


    //valores interpolacion lineal respetar el orden decreciente o creciente al ingresar mas puntos,
    //importante saber que la funcion ubica el valor entre dos puntos buscando que sea menor al siguiente
    // si esta desordenada no generara una valor ccorrecto
    
    //Altura 
    const cx=[650,876,2562,3055,5560,6721]; //700 valor a prueba 
    //Peso 
    const cy=[46000,44000,27580,30000,11000,0]; //46000 valor a prueba


    //Funcion que calcula la interpolación lineal
    function interpol(cx, cy, x) {
       
        let  prod;       
        for (let  j=0; j < cx.length ; j++)
        if (x > cx[j])
        {
            prod = 1;
            let x1, x2, y1,y2;
            x1= cx[j];        
            //env.log("x1 Menor a x  ->>  ", x1);
            y1=cy[j];
            //env.log("valor y1  ->>  ", y1);
            x2=cx[j+1];
            //env.log("X2 Mayor a x  ->>  ", x2);
            y2=cy[j+1];
            //env.log("valor y2  ->>  ", y2);
            prod= y1+(((y2-y1)/(x2-x1))*(x-x1));
            }
            return (prod);
    }       
    // Parsear y almacenar valores
    
    if (jsonPayload.rawData != null) {
        var peso = device.endpoints.byAddress(1);
        var distancia = device.endpoints.byAddress(2);
        let x = jsonPayload.rawData.split(",");

        var min = Math.min.apply(null, cx);
        env.log("Valir minimo tabla",min);
        var max = Math.max.apply(null, cx);
        env.log("valor maximo tabla",max);
        env.log("valor X ",x[0]);
        var dist = x[0];
        var myDate = new Date(jsonPayload.timestamp*1000);
        distancia.updateGenericSensorStatus(dist,myDate.toLocaleString());
                    
        if(x[0] > min && x[0] <max){
                let  xinterpol = interpol(cx,cy,x[0]);
                let pesoInterpolado = xinterpol*1000;
                peso.updateWeightSensorStatus(pesoInterpolado,myDate.toLocaleString());
                env.log("Peso Interpolado ->>  ",pesoInterpolado);
                env.log("Hora ->>  ",myDate.toLocaleString());
        }
        else    
        env.log("No es un valor valido ", jsonPayload.rawData);
        
    }
}


