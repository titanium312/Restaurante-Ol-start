
  //actualizar la tabla

   const [count, setCount] = useState(1);
  const [isDataFetched, setIsDataFetched] = useState(false);
  
  // Maneja el cambio en el contador
  const handleCountChange = (newCount) => {
    setCount(newCount);
  };

  // Función para obtener facturas
  const fetchFacturas = () => {
    console.log("Fetching facturas...");
    // Llama a tu API para obtener facturas
  };

  useEffect(() => {
    if (count === 1 && !isDataFetched) {
      console.log('Cargando datos por primera vez...');
      fetchFacturas();
      setIsDataFetched(true);  // Marcar que los datos han sido cargados

      // Intervalo para actualizar cada 1 segundo
      const intervalId = setInterval(() => {
        fetchFacturas();  // Continuar llamando a la API cada 1 segundo
      }, 1000);

      return () => {
        clearInterval(intervalId);  // Limpiar el intervalo cuando se desmonte
      };
    }
    
    // Resetear cuando count cambia (si es necesario)
    if (count !== 1) {
      setIsDataFetched(false);
    }
  }, [count, isDataFetched]);  // Ejecutar el efecto solo cuando count o isDataFetched cambian

  const urlToCount = "/Hotel/restaurante/recibir-pedido";




<div>
      <h1>Componente Principal</h1>
      <p>Contador: {count}</p>
      <Actualiza urlToCount={urlToCount} onCountChange={handleCountChange} />
    </div>
