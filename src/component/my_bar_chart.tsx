import rwdCanvasRef from '../service/rwdCanvasRef';
import produceBarChart from '../service/produceBarChart'; 

export default function MyBarChart(props: ChartInfo){
  const canvasRef = rwdCanvasRef({
    h_ratio: 0.8,
    w_ratio: 0.8,
    drawAction: produceBarChart(props)
  });
  
  return (
    <div >
      <canvas ref={canvasRef} style={{background: '#ddd'}}>
        'msg for not support canvas'
      </canvas>
    </div>
  );
}