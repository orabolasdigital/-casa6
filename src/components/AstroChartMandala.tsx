/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Componente: Carta / Mandala Astrológica no Padrão Astrodienst / Astro.com
 * Referência: https://www.astro.com/horoscopo/pt (Swiss Ephemeris Chart Drawing)
 */

import React, { useState } from 'react';
import {
  NatalChartData,
  PlanetPosition,
  SIGN_SYMBOLS,
  SIGN_ELEMENTS
} from '../utils/astroEngine';
import { Info } from 'lucide-react';

interface AstroChartMandalaProps {
  chartData: NatalChartData;
  onSelectPlanet?: (planet: PlanetPosition) => void;
}

export const AstroChartMandala: React.FC<AstroChartMandalaProps> = ({
  chartData,
  onSelectPlanet
}) => {
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetPosition | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetPosition | null>(null);

  const size = 600;
  const center = size / 2;
  const outerRadius = 280;
  const signsInnerRadius = 230;
  const housesInnerRadius = 165;
  const aspectsCenterRadius = 120;

  // No Astro.com (Astrodienst), a carta é ancorada no Ascendente (AC) à esquerda (180° / 9 horas)
  const ascLong = chartData.houses[0]?.longitude || 0;

  const getCoordinates = (longitude: number, radius: number) => {
    const angleDeg = (180 - (longitude - ascLong)) % 360;
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = center + radius * Math.cos(angleRad);
    const y = center - radius * Math.sin(angleRad);
    return { x, y, angleDeg, angleRad };
  };

  const getSignFill = (sign: string) => {
    const el = SIGN_ELEMENTS[sign];
    if (el === 'Fogo') return '#FEF2F2';
    if (el === 'Terra') return '#ECFDF5';
    if (el === 'Ar') return '#FFFBEB';
    return '#EFF6FF';
  };

  const getSignStroke = (sign: string) => {
    const el = SIGN_ELEMENTS[sign];
    if (el === 'Fogo') return '#FCA5A5';
    if (el === 'Terra') return '#6EE7B7';
    if (el === 'Ar') return '#FCD34D';
    return '#93C5FD';
  };

  const getSignText = (sign: string) => {
    const el = SIGN_ELEMENTS[sign];
    if (el === 'Fogo') return '#DC2626';
    if (el === 'Terra') return '#059669';
    if (el === 'Ar') return '#D97706';
    return '#2563EB';
  };

  const activePlanet = hoveredPlanet || selectedPlanet;

  const visibleAspects = activePlanet
    ? chartData.aspects.filter(
        (a) => a.planet1 === activePlanet.name || a.planet2 === activePlanet.name
      )
    : chartData.aspects;

  const handlePlanetClick = (planet: PlanetPosition) => {
    if (selectedPlanet?.id === planet.id) {
      setSelectedPlanet(null);
    } else {
      setSelectedPlanet(planet);
      if (onSelectPlanet) onSelectPlanet(planet);
    }
  };

  // Coordenadas das cúspides principais
  const ascCoord = getCoordinates(chartData.houses[0].longitude, outerRadius + 8);
  const mcCoord = getCoordinates(chartData.houses[9].longitude, outerRadius + 8);

  return (
    <div className="flex flex-col items-center select-none w-full">
      <div className="relative w-full max-w-[560px] aspect-square flex items-center justify-center p-2 bg-white rounded-3xl border border-[#E5E0D8] shadow-sm">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full drop-shadow-xs"
        >
          <defs>
            <radialGradient id="astroComCenterGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="85%" stopColor="#FAF8F5" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F0ECE4" stopOpacity="0.6" />
            </radialGradient>
          </defs>

          {/* Fundo do Círculo Exterior */}
          <circle
            cx={center}
            cy={center}
            r={outerRadius}
            fill="#FFFFFF"
            stroke="#DCD6CC"
            strokeWidth="2"
          />

          {/* 1. ANEL EXTERIOR: OS 12 SIGNOS DO ZODÍACO COM MARCADORES ESTILO ASTRO.COM */}
          {Array.from({ length: 12 }).map((_, i) => {
            const startLong = i * 30;
            const endLong = (i + 1) * 30;
            const signName = [
              'Áries', 'Touro', 'Gêmeos', 'Câncer',
              'Leão', 'Virgem', 'Libra', 'Escorpião',
              'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
            ][i];

            const p1 = getCoordinates(startLong, outerRadius);
            const p2 = getCoordinates(endLong, outerRadius);
            const p3 = getCoordinates(endLong, signsInnerRadius);
            const p4 = getCoordinates(startLong, signsInnerRadius);

            const midLong = startLong + 15;
            const labelCoord = getCoordinates(midLong, (outerRadius + signsInnerRadius) / 2);

            const arcPath = `
              M ${p1.x} ${p1.y}
              A ${outerRadius} ${outerRadius} 0 0 0 ${p2.x} ${p2.y}
              L ${p3.x} ${p3.y}
              A ${signsInnerRadius} ${signsInnerRadius} 0 0 1 ${p4.x} ${p4.y}
              Z
            `;

            return (
              <g key={signName}>
                <path
                  d={arcPath}
                  fill={getSignFill(signName)}
                  stroke={getSignStroke(signName)}
                  strokeWidth="1"
                />

                {/* Símbolo Astrológico Oficial */}
                <text
                  x={labelCoord.x}
                  y={labelCoord.y + 6}
                  textAnchor="middle"
                  fill={getSignText(signName)}
                  fontSize="18"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {SIGN_SYMBOLS[signName]}
                </text>
              </g>
            );
          })}

          {/* Círculo divisor dos Signos e Casas */}
          <circle
            cx={center}
            cy={center}
            r={signsInnerRadius}
            fill="none"
            stroke="#DCD6CC"
            strokeWidth="1.5"
          />

          {/* 2. AS 12 CASAS PLACIDUS (ASTRO.COM STYLE) */}
          {chartData.houses.map((house, idx) => {
            const startCoord = getCoordinates(house.longitude, signsInnerRadius);
            const endCoord = getCoordinates(house.longitude, aspectsCenterRadius);

            const nextHouse = chartData.houses[(idx + 1) % 12];
            const midHouseLong = (house.longitude + 15) % 360;
            const numCoord = getCoordinates(midHouseLong, (signsInnerRadius + housesInnerRadius) / 2);

            const isAscendant = idx === 0;
            const isMidheaven = idx === 9;

            return (
              <g key={`house-${house.houseNumber}`}>
                {/* Linha da Cúspide */}
                <line
                  x1={startCoord.x}
                  y1={startCoord.y}
                  x2={endCoord.x}
                  y2={endCoord.y}
                  stroke={isAscendant ? '#D99426' : isMidheaven ? '#7C3AED' : '#E5E0D8'}
                  strokeWidth={isAscendant || isMidheaven ? 2.5 : 1}
                  strokeDasharray={isAscendant || isMidheaven ? 'none' : '3,3'}
                />

                {/* Numeração da Casa no Estilo Astro.com (Azul / Destacado) */}
                <text
                  x={numCoord.x}
                  y={numCoord.y + 4}
                  textAnchor="middle"
                  fill={isAscendant ? '#D99426' : '#3B82F6'}
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {house.houseNumber}
                </text>
              </g>
            );
          })}

          {/* Seta do Ascendente (AC) Oficial Astro.com */}
          <line
            x1={center - outerRadius - 12}
            y1={center}
            x2={center - signsInnerRadius}
            y2={center}
            stroke="#D99426"
            strokeWidth="3.5"
          />
          <polygon
            points={`${center - outerRadius - 14},${center - 5} ${center - outerRadius - 4},${center} ${center - outerRadius - 14},${center + 5}`}
            fill="#D99426"
          />
          <text
            x={center - outerRadius - 18}
            y={center + 4}
            fill="#D99426"
            fontSize="11"
            fontWeight="900"
            textAnchor="end"
          >
            AC
          </text>

          {/* Seta do Meio do Céu (MC) Oficial Astro.com */}
          {(() => {
            const mcOuter = getCoordinates(chartData.houses[9].longitude, outerRadius + 14);
            const mcInner = getCoordinates(chartData.houses[9].longitude, signsInnerRadius);
            return (
              <g>
                <line
                  x1={mcOuter.x}
                  y1={mcOuter.y}
                  x2={mcInner.x}
                  y2={mcInner.y}
                  stroke="#7C3AED"
                  strokeWidth="3"
                />
                <text
                  x={mcOuter.x}
                  y={mcOuter.y - 4}
                  fill="#7C3AED"
                  fontSize="11"
                  fontWeight="900"
                  textAnchor="middle"
                >
                  MC
                </text>
              </g>
            );
          })()}

          {/* Círculo Interno de Aspectos */}
          <circle
            cx={center}
            cy={center}
            r={aspectsCenterRadius}
            fill="url(#astroComCenterGradient)"
            stroke="#DCD6CC"
            strokeWidth="1.5"
          />

          {/* 3. LINHAS DE ASPECTOS NO CENTRO (ASTRO.COM STYLE) */}
          {visibleAspects.map((aspect, idx) => {
            const p1 = chartData.planets.find((p) => p.name === aspect.planet1);
            const p2 = chartData.planets.find((p) => p.name === aspect.planet2);
            if (!p1 || !p2) return null;

            const c1 = getCoordinates(p1.longitude, aspectsCenterRadius);
            const c2 = getCoordinates(p2.longitude, aspectsCenterRadius);

            const isHighlighted =
              activePlanet && (aspect.planet1 === activePlanet.name || aspect.planet2 === activePlanet.name);

            return (
              <line
                key={`aspect-${idx}`}
                x1={c1.x}
                y1={c1.y}
                x2={c2.x}
                y2={c2.y}
                stroke={aspect.color}
                strokeWidth={isHighlighted ? 2.5 : 1.2}
                strokeOpacity={isHighlighted ? 1 : 0.7}
                strokeDasharray={
                  aspect.type === 'Sextil' || aspect.type === 'Quadratura'
                    ? '4,3'
                    : aspect.type === 'Quincúncio' || aspect.type === 'Semissextil'
                    ? '2,2'
                    : 'none'
                }
              />
            );
          })}

          {/* 4. PLANETAS PLOTADOS NO ANEL PLANETÁRIO COM GRAUS ASTRO.COM */}
          {chartData.planets.map((planet) => {
            const coord = getCoordinates(planet.longitude, (signsInnerRadius + housesInnerRadius) / 2);
            const isSelected = selectedPlanet?.id === planet.id;
            const isHovered = hoveredPlanet?.id === planet.id;

            return (
              <g
                key={planet.id}
                className="cursor-pointer transition-transform duration-150"
                onMouseEnter={() => setHoveredPlanet(planet)}
                onMouseLeave={() => setHoveredPlanet(null)}
                onClick={() => handlePlanetClick(planet)}
              >
                {(isSelected || isHovered) && (
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="18"
                    fill="#F0B55E"
                    fillOpacity="0.3"
                    className="animate-pulse"
                  />
                )}

                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r="13"
                  fill={isSelected ? '#22205A' : '#FFFFFF'}
                  stroke={isSelected ? '#F0B55E' : '#22205A'}
                  strokeWidth="1.5"
                  className="shadow-sm"
                />

                <text
                  x={coord.x}
                  y={coord.y + 4.5}
                  textAnchor="middle"
                  fill={isSelected ? '#F0B55E' : '#22205A'}
                  fontSize="13"
                  fontWeight="bold"
                >
                  {planet.symbol}
                </text>

                {planet.isRetrograde && (
                  <text
                    x={coord.x + 9}
                    y={coord.y - 7}
                    fontSize="8"
                    fontWeight="bold"
                    fill="#EF4444"
                  >
                    R
                  </text>
                )}
              </g>
            );
          })}

          {/* Centro Decorativo */}
          <circle cx={center} cy={center} r="6" fill="#22205A" />
          <circle cx={center} cy={center} r="2" fill="#F0B55E" />
        </svg>

        {/* Card Flutuante / Tooltip do Planeta Selecionado */}
        {activePlanet && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs border border-[#D99426]/40 p-3 rounded-2xl shadow-lg flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#22205A] text-[#F0B55E] flex items-center justify-center text-lg font-bold">
                {activePlanet.symbol}
              </div>
              <div>
                <div className="font-heading font-black text-[#22205A] text-sm flex items-center gap-1.5">
                  <span>{activePlanet.name}</span>
                  <span className="text-[#68638C] font-normal text-xs">em</span>
                  <span className="text-[#D99426]">{activePlanet.sign}</span>
                  <span className="text-[11px] font-mono text-[#8C87A3]">
                    {activePlanet.signDegree}°{String(activePlanet.signMinute).padStart(2, '0')}'
                  </span>
                  {activePlanet.isRetrograde && (
                    <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                      Retrógrado
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#554F70] flex items-center gap-2 mt-0.5">
                  <span>Casa {activePlanet.house} (Placidus)</span>
                  <span>&bull;</span>
                  <span>Elemento {activePlanet.element}</span>
                  <span>&bull;</span>
                  <span>Ritmo {activePlanet.modality}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedPlanet(null);
                setHoveredPlanet(null);
              }}
              className="text-[#8C87A3] hover:text-[#22205A] text-xs px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Legenda de Aspectos no Padrão Astro.com */}
      <div className="w-full max-w-[560px] mt-4 flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 bg-[#FAF8F5] rounded-2xl border border-[#E5E0D8] text-[11px] text-[#554F70]">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#22205A]">Aspectos (Astro.com):</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
            Trígono (120°)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
            Sextil (60°)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
            Quadratura (90°)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B91C1C]" />
            Oposição (180°)
          </span>
        </div>

        <div className="text-[10px] text-[#8C87A3] flex items-center gap-1">
          <Info className="h-3 w-3" />
          <span>Sistema Placidus &bull; Swiss Ephemeris</span>
        </div>
      </div>
    </div>
  );
};
