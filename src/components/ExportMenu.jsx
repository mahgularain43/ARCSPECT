// ExportMenu.jsx
import React, { useState, useEffect, useRef } from 'react';

const ExportMenu = ({
  onExportGLB,
  onToggleTopView,
  onToggleMaximize,
  topView,
  maximized,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const ExportIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill={open ? '#f25c45' : '#333'}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M5 20h14v-2H5v2zM12 2L8 6h3v6h2V6h3l-4-4z" />
    </svg>
  );

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Export menu"
        title="Export options"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 8,
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.3s ease',
        }}
      >
        <ExportIcon />
      </button>

      {open && (
        <div style={menuWrapperStyle}>
          <MenuButton
            onClick={() => {
              onExportGLB();
              setOpen(false);
            }}
            icon="📦"
            text="Export 3D (GLB)"
            tooltip="Download your 3D model file"
          />
          <MenuButton
            onClick={() => {
              onToggleTopView();
              setOpen(false);
            }}
            icon="🧭"
            text={topView ? 'Switch to 3D View' : 'Switch to Top View'}
            tooltip={topView ? 'Return to perspective view' : 'View from the top'}
          />
          <MenuButton
            onClick={() => {
              onToggleMaximize();
              setOpen(false);
            }}
            icon={maximized ? '📉' : '📈'}
            text={maximized ? 'Minimize View' : 'Maximize View'}
            tooltip={maximized ? 'Reduce the layout height' : 'Expand for better view'}
          />
        </div>
      )}
    </div>
  );
};

const MenuButton = ({ onClick, icon, text, tooltip }) => {
  const themeColor = '#f25c45';

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <button
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 16px',
          marginBottom: '12px',
          width: '100%',
          fontWeight: 600,
          fontSize: 14,
          background: themeColor,
          border: `2px solid ${themeColor}`,
          borderRadius: 14,
          color: '#fff',
          cursor: 'pointer',
          boxShadow: `0 3px 10px ${themeColor}55`,
          transition: 'all 0.2s ease-in-out',
        }}
        onMouseEnter={(e) => {
          const tip = e.currentTarget.nextSibling;
          if (tip) tip.style.opacity = 1;
        }}
        onMouseLeave={(e) => {
          const tip = e.currentTarget.nextSibling;
          if (tip) tip.style.opacity = 0;
        }}
      >
        <span style={{ fontSize: 18 }}>{icon}</span> {text}
      </button>

      <div style={tooltipStyle}>{tooltip}</div>
    </div>
  );
};

const menuWrapperStyle = {
  position: 'absolute',
  top: '110%',
  right: 0,
  borderRadius: 16,
  padding: 16,
  boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
  zIndex: 100,
  width: 250,
  backgroundColor: 'white',
};

const tooltipStyle = {
  position: 'absolute',
  bottom: '100%',
  background: '#1f1f1f',
  color: '#fff',
  fontSize: '12px',
  padding: '6px 10px',
  borderRadius: 8,
  marginBottom: 6,
  whiteSpace: 'nowrap',
  opacity: 0,
  transition: 'opacity 0.2s ease',
  zIndex: 101,
  pointerEvents: 'none',
  textAlign: 'center',
};

export default ExportMenu;
