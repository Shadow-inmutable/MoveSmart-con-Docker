import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function GraficaComparacion({
  data,
}) {
  return (
    <div style={containerStyle}>

      <h4 style={titleStyle}>
        🛣️ Base vs Recorrido Vial
      </h4>

      <div style={chartContainerStyle}>

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 8,
              left: -12,
              bottom: 8,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="ruta"
              tick={{
                fontSize: 9,
              }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={45}
            />

            <YAxis
              tick={{
                fontSize: 9,
              }}
              width={35}
            />

            <Tooltip />

            <Legend
              wrapperStyle={{
                fontSize: "10px",
              }}
            />

            <Bar
              dataKey="tiempo_base"
              fill="#ef4444"
              name="Tiempo base"
              radius={[
                5,
                5,
                0,
                0,
              ]}
            />

            <Bar
              dataKey="tiempo_vial"
              fill="#2563eb"
              name="Tiempo vial"
              radius={[
                5,
                5,
                0,
                0,
              ]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

const containerStyle = {
  width: "100%",
  height: "100%",
  minWidth: 0,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
};

const titleStyle = {
  flexShrink: 0,
  margin: "0 0 8px 0",
  color: "#2B3674",
  fontSize: "13px",
  fontWeight: "800",
};

const chartContainerStyle = {
  flex: 1,
  minHeight: 0,
  minWidth: 0,
};