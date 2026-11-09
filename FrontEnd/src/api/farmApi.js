import axiosInstance from './axiosInstance';

const extractArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.content)) return data.content;
  if (Array.isArray(data.farms)) return data.farms;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.records)) return data.records;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.results)) return data.results;
  if (typeof data === 'object' && data !== null) {
    if (data.id || data.farmId || data.farmName || data.name) {
      return [data];
    }
  }
  return [];
};

const mapFarmFromBackend = (dto) => {
  if (!dto) return null;
  const unit = dto.areaUnit || 'Acres';
  const numericArea = dto.area != null ? parseFloat(dto.area) : 0;
  const displayArea = dto.area != null ? `${numericArea} ${unit}` : '0 Acres';
  const farmerName = dto.farmerName || dto.ownerUsername || dto.owner || 'Ramesh Kumar';
  return {
    ...dto,
    id: dto.farmId || dto.id,
    farmId: dto.farmId || dto.id,
    farmerName: farmerName,
    farmer: farmerName,
    name: dto.farmName || dto.name || 'Unnamed Farm',
    farmName: dto.farmName || dto.name || 'Unnamed Farm',
    location: dto.location || '',
    numericArea: numericArea,
    areaValue: numericArea,
    areaUnit: unit,
    area: displayArea,
    waterSource: dto.waterSource || 'Borewell',
    currentCrop: dto.currentCrop || '',
    status: dto.status || 'Healthy',
    ownerId: dto.ownerId,
    owner: dto.ownerUsername || dto.owner || farmerName,
    manager: dto.ownerUsername || dto.manager || farmerName,
  };
};

const mapFarmToBackend = (payload = {}) => {
  const rawArea = payload.numericArea != null 
    ? payload.numericArea 
    : (payload.areaValue != null 
        ? payload.areaValue 
        : (payload.area != null ? String(payload.area).replace(/[^0-9.]/g, '') : ''));
  const parsedArea = parseFloat(rawArea);
  const validArea = !isNaN(parsedArea) && parsedArea > 0 ? parsedArea : 1.0;

  let ownerId = Number(payload.ownerId || payload.userId);
  if (isNaN(ownerId) || ownerId <= 0) {
    try {
      const stored = localStorage.getItem('farmverse-auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.user?.id) {
          ownerId = Number(parsed.user.id);
        }
      }
    } catch {}
  }
  if (isNaN(ownerId) || ownerId <= 0) {
    ownerId = 1;
  }

  return {
    farmName: payload.name || payload.farmName || 'New Farm',
    farmerName: payload.farmerName || payload.farmer || '',
    location: payload.location || 'Default Location',
    area: validArea,
    areaUnit: payload.areaUnit || 'Acres',
    waterSource: payload.waterSource || 'Borewell',
    currentCrop: payload.currentCrop || '',
    sowingDate: payload.sowingDate || null,
    harvestingDate: payload.harvestingDate || null,
    status: payload.status || 'Healthy',
    ownerId,
  };
};

export const getFarms = async () => {
  const response = await axiosInstance.get('/farms');
  const list = extractArray(response.data);
  return list.map(mapFarmFromBackend).filter(Boolean);
};

export const getFarmById = async (id) => {
  const response = await axiosInstance.get(`/farms/${id}`);
  return mapFarmFromBackend(response.data);
};

export const createFarm = async (payload) => {
  const backendPayload = mapFarmToBackend(payload);
  const response = await axiosInstance.post('/farms', backendPayload);
  return mapFarmFromBackend(response.data);
};

export const updateFarm = async (id, payload) => {
  const backendPayload = mapFarmToBackend(payload);
  const response = await axiosInstance.put(`/farms/${id}`, backendPayload);
  return mapFarmFromBackend(response.data);
};

export const deleteFarm = async (id) => {
  const response = await axiosInstance.delete(`/farms/${id}`);
  return response.data;
};