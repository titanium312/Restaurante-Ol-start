
/*

   const [count, setCount] = useState(1);
  const [isDataFetched, setIsDataFetched] = useState(false);
  

  const handleCountChange = (newCount) => {
    setCount(newCount);
  };

  const fetchFacturas = () => {
    console.log("Fetching facturas...");

  };

  useEffect(() => {
    if (count === 1 && !isDataFetched) {
      console.log('Cargando datos por primera vez...');
      fetchFacturas();
      setIsDataFetched(true);  


      const intervalId = setInterval(() => {
        fetchFacturas();  
      }, 1000);

      return () => {
        clearInterval(intervalId);  
      };
    }
    

    if (count !== 1) {
      setIsDataFetched(false);
    }
  }, [count, isDataFetched]); 

  const urlToCount = "/Hotel/restaurante/recibir-pedido";




<div>
      <h1>Componente Principal</h1>
      <p>Contador: {count}</p>
      <Actualiza urlToCount={urlToCount} onCountChange={handleCountChange} />
    </div>


*/