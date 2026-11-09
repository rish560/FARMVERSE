
import { ArrowLeft, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { FarmWeatherBadge } from '../components/features/FarmWeatherBadge';
import { FarmDetailView } from '../components/features/FarmDetailView';
import { CropsList } from '../components/features/CropsList';
import { CropDetailView } from '../components/features/CropDetailView';
import { UsersList } from '../components/features/UsersList';
import { LoadingState } from '../components/ui/LoadingState';
import { normalizeRole } from '../config/roleRoutes';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import appleImage from '../assets/crops/apple.jpg';
import bananaImage from '../assets/crops/banana.jpg';
import cornImage from '../assets/crops/corn.jpg';
import cottonImage from '../assets/crops/cotton.jpg';
import groundnutImage from '../assets/crops/groundnut.jpg';
import mangoImage from '../assets/crops/mango.jpg';
import mustardImage from '../assets/crops/mustard.jpg';
import onionImage from '../assets/crops/onion.jpg';
import potatoImage from '../assets/crops/potato.jpg';
import riceImage from '../assets/crops/rice.jpg';
import soybeanImage from '../assets/crops/soybean.jpg';
import sugarCaneImage from '../assets/crops/SugarCane.jpg';
import teaImage from '../assets/crops/tea.jpg';
import tomatoImage from '../assets/crops/tomato.jpg';
import wheatImage from '../assets/crops/wheat.jpg';

// Import custom API modules
import { getUsers, createUser, updateUser, deleteUser } from '../api/userApi';
import { getFarms, createFarm, updateFarm, deleteFarm } from '../api/farmApi';
import { getCrops, createCrop, updateCrop, deleteCrop } from '../api/cropApi';

const apis = {
  users: { load: getUsers, create: createUser, update: updateUser, delete: deleteUser },
  farms: { load: getFarms, create: createFarm, update: updateFarm, delete: deleteFarm },
  crops: { load: getCrops, create: createCrop, update: updateCrop, delete: deleteCrop },
};

const getTableColumns = (t) => ({
  farms: [
    ['name', t('farmNameLabel')],
    ['location', t('locationLabel')],
    ['area', t('areaLabel').replace(/\s*\(.*\)$/, '')],
    ['currentCrop', t('cropColumnLabel')],
    ['waterSource', t('waterSourceLabel')],
    ['status', t('statusLabel')]
  ],
  crops: [
    ['name', t('cropNameLabel')],
    ['farm', t('farmColumnLabel')]
  ],
  users: [
    ['fullName', t('fullNameLabel')],
    ['email', t('emailLabel')],
    ['role', t('roleLabel')],
    ['phoneNumber', t('phoneNumberLabel')]  // ← was 'phone'; backend DTO field is 'phoneNumber'
  ]
});

const ROLE_LABEL_KEYS = {
  Admin: 'adminRole',
  'Farm Manager': 'farmManagerRole',
  Guest: 'guestRole',
};

const getFiltersList = (t) => ({
  farms: [
    { value: 'Healthy', label: t('farmStatus_Healthy') },
    { value: 'Needs Attention', label: t('farmStatus_Needs Attention') },
    { value: 'Under Maintenance', label: t('farmStatus_Under Maintenance') },
    { value: 'Inactive', label: t('farmStatus_Inactive') },
  ],
  crops: [
    { value: 'Healthy', label: t('farmStatus_Healthy') },
    { value: 'Needs Attention', label: t('farmStatus_Needs Attention') },
    { value: 'Under Maintenance', label: t('farmStatus_Under Maintenance') },
    { value: 'Inactive', label: t('farmStatus_Inactive') },
  ],
  users: [
    { value: 'Admin', label: t('adminRole') },
    { value: 'Farm Manager', label: t('farmManagerRole') },
    { value: 'Guest', label: t('guestRole') },
  ]
});

const TITLE_KEY_MAP = {
  'Add and manage farms': 'addManageFarmsTitle',
  'Add and manage crops': 'addManageCropsTitle',
  'My farms': 'myFarmsTitle',
  'Crop production': 'cropProductionTitle',
  'Manage farms': 'manageFarmsTitle',
  'Manage crops': 'manageCropsTitle',
  'Manage users': 'manageUsersTitle',
  'View admins': 'viewAdminsTitle',
  'View farm managers': 'viewFarmManagersTitle',
  'View guests': 'viewGuestsTitle',
};

const translateStatusValue = (t, resource, key, value) => {
  if (!value) return value;
  if (resource === 'farms' && key === 'status') return t(`farmStatus_${value}`);
  if (resource === 'crops' && key === 'health') return t(`cropHealth_${value}`);
  if (resource === 'crops' && key === 'status') return t(`cropStatus_${value}`);
  if (resource === 'crops' && key === 'stage') return t(`growthStage_${value}`);
  if (resource === 'users' && key === 'role') return ROLE_LABEL_KEYS[value] ? t(ROLE_LABEL_KEYS[value]) : value;
  return value;
};

export const PRESET_CROPS = [
  'Rice', 'Wheat', 'Corn', 'Sugarcane', 'Cotton', 'Potato', 'Tomato',
  'Onion', 'Mustard', 'Soybean', 'Groundnut', 'Banana', 'Mango', 'Apple', 'Tea'
];

const getCropImage = (cropName) => {
  const normalized = String(cropName || '').trim().toLowerCase();

  if (!normalized) return null;
  if (normalized.includes('apple')) return appleImage;
  if (normalized.includes('banana')) return bananaImage;
  if (normalized.includes('corn')) return cornImage;
  if (normalized.includes('cotton')) return cottonImage;
  if (normalized.includes('groundnut') || normalized.includes('peanut')) return groundnutImage;
  if (normalized.includes('mango')) return mangoImage;
  if (normalized.includes('mustard')) return mustardImage;
  if (normalized.includes('onion')) return onionImage;
  if (normalized.includes('potato')) return potatoImage;
  if (normalized.includes('rice')) return riceImage;
  if (normalized.includes('soybean') || normalized.includes('soy bean')) return soybeanImage;
  if (normalized.includes('sugarcane') || normalized.includes('sugar cane')) return sugarCaneImage;
  if (normalized.includes('tea')) return teaImage;
  if (normalized.includes('tomato')) return tomatoImage;
  if (normalized.includes('wheat')) return wheatImage;

  return null;
};

export const AREA_UNITS = ['Acres', 'Hectares', 'Square Meter'];
export const WATER_SOURCES = ['Borewell', 'Well', 'Canal', 'River', 'Pond', 'Rainwater', 'Tap Water'];
export const FARM_STATUSES = ['Healthy', 'Monitoring', 'Optimized', 'Needs Attention', 'Under Maintenance', 'Inactive'];

export const GROWTH_STAGES = ['Seeding', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest Ready', 'Maturity'];
export const CROP_HEALTHS = ['Excellent', 'Good', 'Average', 'Poor', 'Diseased'];
export const CROP_STATUSES = ['Active', 'Planned', 'Harvested', 'Inactive'];

export const RecordManagement = ({ resource, canManage = false, roleFilter, title }) => {
  const apiSetup = apis[resource];
  const { t } = useLanguage();
  const columns = useMemo(() => getTableColumns(t)[resource], [t, resource]);
  const filters = useMemo(() => getFiltersList(t)[resource], [t, resource]);

  const location = useLocation();
  const isAddRoute = location.pathname.endsWith('add-farm') || location.pathname.endsWith('add-crop');

  const { user } = useAuth();
  const { addToast } = useToast();

  const currentRole = normalizeRole(user?.role);
  const isAdmin = currentRole === 'ADMIN';
  const isManager = currentRole === 'FARM_MANAGER';
  const isGuest = currentRole === 'GUEST' || (!isAdmin && !isManager);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState(isAddRoute ? 'create' : null);
  const [saving, setSaving] = useState(false);
  const [farmsList, setFarmsList] = useState([]);

  const defaultFarmerName = useMemo(() => {
    return user?.fullName || user?.username || 'Ramesh Kumar';
  }, [user]);

  const isOwnRecord = useCallback(
    (item) => {
      if (!item || !user) return false;
      if (isAdmin) return true;
      if (isGuest) return false;

      const userIdStr = String(user.id || '').toLowerCase();
      const userNameStr = String(user.fullName || user.name || '').toLowerCase().trim();
      const userEmailStr = String(user.email || '').toLowerCase().trim();

      const checkFields = [
        item.createdBy,
        item.userId,
        item.user_id,
        item.farmerId,
        item.farmer_id,
        item.ownerId,
        item.owner_id,
        item.owner,
        item.manager,
        item.farmer,
        item.farmerName,
        item.farmOwner,
        item.farmOwnerName,
        item.farmManager,
        item.ownerUsername,
      ];

      const matchesUserIdentity = (value) => {
        if (value === undefined || value === null || value === '') return false;
        const sVal = String(value).toLowerCase().trim();
        return (
          (userIdStr && sVal === userIdStr) ||
          (userEmailStr && sVal === userEmailStr) ||
          (userNameStr && (sVal === userNameStr || sVal.includes(userNameStr) || userNameStr.includes(sVal)))
        );
      };

      for (const val of checkFields) {
        if (matchesUserIdentity(val)) {
          return true;
        }
      }

      if (resource === 'crops' && Array.isArray(farmsList)) {
        const cropFarmId = String(item.farmId || item.farm_id || item.farm?.id || item.farm?.farmId || '').trim();
        const cropFarmName = String(item.farm || item.farmName || '').toLowerCase().trim();

        const matchedFarm = farmsList.find((farm) => {
          const farmId = String(farm.id || farm.farmId || '').trim();
          const farmName = String(farm.name || farm.farmName || '').toLowerCase().trim();
          return (
            (cropFarmId && farmId && cropFarmId === farmId) ||
            (cropFarmName && farmName && farmName === cropFarmName)
          );
        });

        if (matchedFarm) {
          const farmOwnerId = String(matchedFarm.ownerId || matchedFarm.owner_id || matchedFarm.managerId || matchedFarm.userId || matchedFarm.user_id || '').toLowerCase();
          const farmOwnerName = String(matchedFarm.owner || matchedFarm.manager || matchedFarm.farmerName || matchedFarm.farmer || matchedFarm.ownerUsername || '').toLowerCase().trim();
          const farmOwnerEmail = String(matchedFarm.ownerEmail || '').toLowerCase().trim();

          if (
            (userIdStr && farmOwnerId === userIdStr) ||
            (userNameStr && farmOwnerName.includes(userNameStr)) ||
            (userEmailStr && (farmOwnerEmail.includes(userEmailStr) || farmOwnerName.includes(userEmailStr)))
          ) {
            return true;
          }
        }
      }

      return false;
    },
    [isAdmin, isGuest, user, resource, farmsList]
  );

  const canAdd = resource === 'crops' ? false : resource === 'users' ? isAdmin : (isAdmin || isManager);

  const canEdit = useCallback(
    (item) => {
      if (resource === 'users') return isAdmin;
      if (resource === 'farms') return isAdmin || (isManager && isOwnRecord(item));
      // Crops are now derived from each farm's "currentCrop" field, not a
      // standalone editable record -- edit the farm instead to change its crop.
      if (resource === 'crops') return false;
      return isAdmin;
    },
    [isAdmin, isManager, isOwnRecord, resource]
  );

  const canDelete = useCallback(
    (item) => {
      if (resource === 'users') return isAdmin;
      if (resource === 'farms') return isAdmin || (isManager && isOwnRecord(item));
      if (resource === 'crops') return false;
      return isAdmin;
    },
    [isAdmin, isManager, isOwnRecord, resource]
  );

  useEffect(() => {
    if (isAddRoute) {
      setMode('create');
    }
  }, [isAddRoute]);

  const loadFarmsList = useCallback(async () => {
    try {
      const data = await getFarms();
      setFarmsList(data || []);
    } catch {}
  }, []);

  // Farms list is only needed to match a crop to its farm (My Crops ownership
  // check). Fetching it on farms/users pages was wasted, redundant work --
  // farms pages already fetch farms via loadRecords(), so this was doubling
  // the network/DB round trip on every "View Farms" / "Add Farm" page load.
  useEffect(() => {
    if (resource === 'crops') {
      loadFarmsList();
    }
  }, [resource, loadFarmsList]);

  // Re-fetch the latest farms from the backend whenever the crops form becomes
  // active (either via the add-crop route or by switching mode to create/edit).
  // This ensures a newly-added farm is always visible in the Farmer/Farm dropdown
  // without requiring a browser reload.
  useEffect(() => {
    if (resource === 'crops' && isAddRoute) {
      loadFarmsList();
    }
  }, [resource, isAddRoute, loadFarmsList]);

  const getBlankRecord = useCallback((latestFarmsList) => {
    const farms = latestFarmsList || farmsList;
    if (resource === 'farms') {
      return {
        farmerName: defaultFarmerName,
        name: '',
        location: '',
        currentCrop: '',
        sowingDate: '',
        harvestingDate: '',
        area: '',
        waterSource: '',
        status: 'Healthy',
      };
    }
    if (resource === 'crops') {
      const defaultFarmId = farms && farms.length > 0 ? (farms[0].id || farms[0].farmId) : '';
      return {
        farmerName: defaultFarmerName,
        name: '',
        farmId: defaultFarmId,
        stage: 'Vegetative',
        health: 'Excellent',
        plantingDate: '',
        expectedYield: '',
        status: 'Active',
      };
    }
    return { fullName: '', email: '', role: 'Farm Manager', phoneNumber: '', address: '' };
  }, [resource, farmsList, defaultFarmerName]);

  const [record, setRecord] = useState(() => getBlankRecord());

  // NOTE: only reset the form when we *enter* the add-route (isAddRoute
  // flips false -> true), not every time getBlankRecord's identity changes.
  // getBlankRecord depends on farmsList, which loads asynchronously — if we
  // included it here, the effect would re-fire the moment the farms list
  // finished loading and silently wipe out whatever the user had already
  // typed (e.g. Crop Name), forcing them to re-enter it a second time.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isAddRoute) {
      setRecord(getBlankRecord());
    }
  }, [isAddRoute]);

  const openCreateModal = async () => {
    // For crops: always refetch the latest farms so the dropdown is up-to-date
    if (resource === 'crops') {
      try {
        const latestFarms = await getFarms();
        setFarmsList(latestFarms || []);
        setRecord(getBlankRecord(latestFarms || []));
      } catch {
        setRecord(getBlankRecord());
      }
    } else {
      setRecord(getBlankRecord());
    }
    setMode('create');
  };

  const openEditModal = (item) => {
    if (resource === 'farms') {
      setRecord({
        ...item,
        farmerName: item.farmerName || item.farmer || item.owner || defaultFarmerName,
        name: item.name || item.farmName || '',
        location: item.location || '',
        currentCrop: item.currentCrop || '',
        sowingDate: item.sowingDate || '',
        harvestingDate: item.harvestingDate || '',
        area: item.area || (item.numericArea != null ? `${item.numericArea} ${item.areaUnit || 'Acres'}` : ''),
        waterSource: item.waterSource || '',
        status: item.status || 'Healthy',
      });
    } else if (resource === 'crops') {
      const cropName = item.name || item.cropName || '';

      setRecord({
        ...item,
        farmerName: item.farmerName || item.farmer || defaultFarmerName,
        name: cropName,
        farmId: item.farmId || (farmsList.find(f => (f.name || f.farmName) === item.farm)?.id) || '',
        stage: item.stage || 'Vegetative',
        health: item.health || 'Excellent',
        plantingDate: item.plantingDate || '',
        expectedYield: item.expectedYield || '',
        status: item.status || 'Active',
      });
    } else {
      setRecord({ ...item });
    }
    setMode('edit');
  };

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (resource === 'crops') {
        // "Crops" are entered as a field on the Farm itself (currentCrop) --
        // there is no separate crop-creation flow, so derive the crop list
        // straight from farms instead of the (permanently empty) crops table.
        const farms = await getFarms();
        data = farms
          .filter((farm) => farm.currentCrop && farm.currentCrop.trim())
          .map((farm) => ({
            id: `crop-${farm.id}`,
            cropId: farm.id,
            farmId: farm.id,
            name: farm.currentCrop,
            crop: farm.currentCrop,
            farm: farm.name,
            farmName: farm.name,
            location: farm.location,
            sowingDate: farm.sowingDate,
            harvestingDate: farm.harvestingDate,
            status: farm.status,
            ownerId: farm.ownerId,
            owner: farm.owner,
            ownerUsername: farm.owner,
            manager: farm.manager,
            farmer: farm.farmer,
            farmerName: farm.farmerName,
          }));
      } else {
        data = await apiSetup.load();
      }
      setRecords(data);
    } catch {
      const loadErrorMsg = resource === 'farms' ? t('unableToLoadFarmsToast') : resource === 'crops' ? t('unableToLoadCropsToast') : resource === 'users' ? t('unableToLoadUsersToast') : `Unable to load ${resource}.`;
      addToast(loadErrorMsg, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast, resource, apiSetup, t]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  useEffect(() => {
    setPage(1);
  }, [resource, roleFilter, filter, search]);

  const scopedRecords = useMemo(() => {
    if (!records) return [];
    let list = records;

    const isMyFarmsView = resource === 'farms' && title === 'My farms' && isManager && !isAdmin;
    const isMyCropsView = resource === 'crops' && (title === 'Crop production' || title === 'My crops') && isManager && !isAdmin;

    if (isMyFarmsView) {
      const userIdStr = String(user?.id || '').toLowerCase();
      const userNameStr = String(user?.fullName || user?.name || user?.username || '').toLowerCase().trim();
      const userEmailStr = String(user?.email || '').toLowerCase().trim();

      list = list.filter((farm) => {
        const ownerId = String(farm.ownerId || farm.owner_id || '').toLowerCase();
        const ownerName = String(farm.owner || farm.manager || farm.farmerName || '').toLowerCase().trim();
        const ownerEmail = String(farm.ownerEmail || '').toLowerCase().trim();

        return (
          ownerId === userIdStr ||
          ownerName.includes(userNameStr) ||
          ownerEmail.includes(userEmailStr) ||
          ownerName.includes(userEmailStr)
        );
      });
    }

    if (isMyCropsView) {
      list = list.filter((crop) => isOwnRecord(crop));
    }

    if (roleFilter) {
      const normTargetRole = normalizeRole(roleFilter);
      list = list.filter((r) => normalizeRole(r.role) === normTargetRole || r.role === roleFilter);
    }
    return list;
  }, [records, roleFilter, resource, title, isManager, isAdmin, user, isOwnRecord]);

  // Segment key: 'status' for farms, 'health' for crops -- drives the segmented tabs below.
  // Segmentation tabs are an Admin-only overview feature -- Farm Manager and
  // Guest dashboards stay simple (no status tabs above their farms/crops list).
  const segmentKey = isAdmin && (resource === 'farms' || resource === 'crops') ? 'status' : null;

  const segmentCounts = useMemo(() => {
    if (!segmentKey) return {};
    return scopedRecords.reduce((acc, r) => {
      const key = r[segmentKey] || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [scopedRecords, segmentKey]);

  const visibleRecords = useMemo(() => {
    let list = scopedRecords;

    if (filter !== 'All') {
      const normFilter = normalizeRole(filter);
      list = list.filter((r) => r.status === filter || r.health === filter || normalizeRole(r.role) === normFilter || r.role === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        Object.values(r).some((val) => String(val || '').toLowerCase().includes(q))
      );
    }
    return list;
  }, [scopedRecords, filter, search]);

  const PAGE_SIZE = 6;
  const pages = Math.max(1, Math.ceil(visibleRecords.length / PAGE_SIZE));

  useEffect(() => {
    if (page > pages) {
      setPage(1);
    }
  }, [page, pages]);

  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return visibleRecords.slice(start, start + PAGE_SIZE);
  }, [visibleRecords, page]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const savePayload = { ...record };

      if (resource === 'farms') {
        if (!savePayload.name || !savePayload.name.trim()) {
          addToast(t('farmNameRequiredToast'), 'error');
          setSaving(false);
          return;
        }
        if (!savePayload.location || !savePayload.location.trim()) {
          addToast(t('locationRequiredToast'), 'error');
          setSaving(false);
          return;
        }
        if (!savePayload.currentCrop || !savePayload.currentCrop.trim()) {
          addToast(t('cropCurrentCropRequiredToast'), 'error');
          setSaving(false);
          return;
        }
        if (!savePayload.area || !String(savePayload.area).trim()) {
          addToast(t('areaRequiredToast'), 'error');
          setSaving(false);
          return;
        }
        if (!savePayload.waterSource || !savePayload.waterSource.trim()) {
          addToast(t('waterSourceRequiredToast'), 'error');
          setSaving(false);
          return;
        }

        // Parse a free-text area like "48 acres" into a number + unit for the backend
        const areaText = String(savePayload.area).trim();
        const areaMatch = areaText.match(/([\d.]+)\s*(.*)/);
        const numArea = areaMatch ? parseFloat(areaMatch[1]) : NaN;
        if (isNaN(numArea) || numArea <= 0) {
          addToast(t('areaInvalidToast'), 'error');
          setSaving(false);
          return;
        }
        const unitText = (areaMatch && areaMatch[2] ? areaMatch[2].trim() : '').toLowerCase();
        const matchedUnit = AREA_UNITS.find((u) => u.toLowerCase() === unitText)
          || AREA_UNITS.find((u) => unitText.startsWith(u.toLowerCase().slice(0, 4)))
          || 'Acres';

        savePayload.name = savePayload.name.trim();
        savePayload.farmName = savePayload.name;
        savePayload.location = savePayload.location.trim();
        savePayload.currentCrop = savePayload.currentCrop.trim();
        savePayload.waterSource = savePayload.waterSource.trim();
        savePayload.status = savePayload.status || 'Healthy';
        savePayload.farmerName = (savePayload.farmerName || defaultFarmerName || '').trim();
        savePayload.farmer = savePayload.farmerName;
        savePayload.numericArea = numArea;
        savePayload.areaUnit = matchedUnit;
        savePayload.area = `${numArea} ${matchedUnit}`;
      } else if (resource === 'crops') {
        const finalCropName = (savePayload.name || '').trim();

        if (!finalCropName) {
          addToast(t('cropNameRequiredToast'), 'error');
          setSaving(false);
          return;
        }
        if (finalCropName.length > 100) {
          addToast(t('cropNameTooLongToast'), 'error');
          setSaving(false);
          return;
        }
        if (!savePayload.farmId) {
          addToast(t('assignedFarmRequiredToast'), 'error');
          setSaving(false);
          return;
        }
        if (!savePayload.stage) {
          addToast(t('growthStageRequiredToast'), 'error');
          setSaving(false);
          return;
        }
        if (!savePayload.health) {
          addToast(t('cropHealthRequiredToast'), 'error');
          setSaving(false);
          return;
        }
        if (!savePayload.plantingDate) {
          addToast(t('plantingDateRequiredToast'), 'error');
          setSaving(false);
          return;
        }
        if (!savePayload.expectedYield || !String(savePayload.expectedYield).trim()) {
          addToast(t('expectedYieldRequiredToast'), 'error');
          setSaving(false);
          return;
        }

        savePayload.farmerName = savePayload.farmerName || defaultFarmerName;
        savePayload.farmer = savePayload.farmerName;
        savePayload.name = finalCropName;
        savePayload.cropName = finalCropName;
        savePayload.expectedYield = String(savePayload.expectedYield).trim();
        savePayload.status = savePayload.status || 'Active';
      }

      if (mode === 'create') {
        if (user) {
          if (!savePayload.createdBy) savePayload.createdBy = user.id || user.email || user.fullName;
          if (!savePayload.userId) savePayload.userId = user.id;
          if (!savePayload.owner) savePayload.owner = savePayload.farmerName || user.fullName;
          if (!savePayload.manager) savePayload.manager = savePayload.farmerName || user.fullName;
        }
        await apiSetup.create(savePayload);
      } else {
        await apiSetup.update(record.id || record.farmId || record.cropId, savePayload);
      }
      addToast(
        resource === 'farms'
          ? (mode === 'create' ? t('farmCreatedToast') : t('farmUpdatedToast'))
          : resource === 'crops'
          ? (mode === 'create' ? t('cropCreatedToast') : t('cropUpdatedToast'))
          : resource === 'users'
          ? (mode === 'create' ? t('userCreatedToast') : t('userUpdatedToast'))
          : `${resource.slice(0, -1)} ${mode === 'create' ? 'created' : 'updated'} successfully.`,
        'success',
      );
      setMode(null);
      await loadRecords();
    } catch (err) {
      const backendMessage = err?.response?.data?.message;
      addToast(backendMessage || t('unableToSaveRecordToast'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setSaving(true);
    try {
      await apiSetup.delete(record.id || record.farmId || record.cropId);
      addToast(
        resource === 'farms' ? t('farmDeletedToast') : resource === 'crops' ? t('cropDeletedToast') : resource === 'users' ? t('userDeletedToast') : `${resource.slice(0, -1)} deleted successfully.`,
        'success',
      );
      setMode(null);
      await loadRecords();
    } catch {
      addToast(t('unableToDeleteRecordToast'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState label={resource === 'farms' ? t('loadingFarmsLabel') : resource === 'crops' ? t('loadingCropsLabel') : resource === 'users' ? t('loadingUsersLabel') : `Loading ${title || `${resource} records`}...`} />;

  if (mode) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-black">
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setMode(null)}
              className="gap-1.5 text-xs px-3 py-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {resource === 'farms' ? t('viewAllFarms') : resource === 'crops' ? t('viewAllCrops') : `View all ${resource}`}
            </Button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-green-600">
                {mode === 'delete'
                  ? t('confirmDeletionLabel')
                  : mode === 'create' && resource === 'farms'
                  ? t('createFarmEyebrow')
                  : mode === 'create' && resource === 'crops'
                  ? t('createCropEyebrow')
                  : mode === 'edit' && resource === 'farms'
                  ? t('editFarmEyebrow')
                  : mode === 'view' && resource === 'farms'
                  ? t('viewFarmEyebrow')
                  : mode === 'edit' && resource === 'crops'
                  ? t('editCropEyebrow')
                  : mode === 'view' && resource === 'crops'
                  ? t('viewCropEyebrow')
                  : mode === 'edit' && resource === 'users'
                  ? t('editUserEyebrow')
                  : mode === 'view' && resource === 'users'
                  ? t('viewUserEyebrow')
                  : `${mode} ${resource.slice(0, -1)}`}
              </p>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {mode === 'create' && resource === 'farms'
                  ? t('addFarm')
                  : mode === 'create' && resource === 'crops'
                  ? t('addCrop')
                  : mode === 'create' && resource === 'users'
                  ? t('addUserButton')
                  : mode === 'create'
                  ? `Add ${resource.slice(0, -1)}`
                  : (record.farmerName || record.name || record.fullName || t('recordDetailsFallback'))}
              </h2>
            </div>
          </div>
        </div>

        <Card>
          {mode === 'delete' && canDelete(record) ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {resource === 'farms' ? t('deleteConfirmFarmMessage') : resource === 'crops' ? t('deleteConfirmCropMessage') : resource === 'users' ? t('deleteConfirmUserMessage') : `Are you sure you want to delete this ${resource.slice(0, -1)} record? This action cannot be undone.`}
              </p>
              <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                <Button variant="secondary" onClick={() => setMode(null)}>{t('cancelButton')}</Button>
                <Button variant="danger" disabled={saving} onClick={handleRemove}>
                  {saving ? t('deletingButton') : t('deleteButton')}
                </Button>
              </div>
            </div>
          ) : mode === 'view' ? (
            resource === 'farms' ? (
              <div className="space-y-6">
                <FarmDetailView record={record} t={t} translateStatusValue={translateStatusValue} />
                <div className="flex justify-end border-t border-gray-100 pt-4">
                  <Button variant="secondary" onClick={() => setMode(null)}>{t('backToListButton')}</Button>
                </div>
              </div>
            ) : resource === 'crops' ? (
              <div className="space-y-6">
                <CropDetailView record={record} t={t} />
                <div className="flex justify-end border-t border-gray-100 pt-4">
                  <Button variant="secondary" onClick={() => setMode(null)}>{t('backToListButton')}</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3.5 dark:border-slate-800 dark:bg-slate-900">
                      <dt className="text-xs font-semibold uppercase text-gray-400">{t('fullNameLabel')}</dt>
                      <dd className="mt-1 font-medium text-gray-900 text-sm dark:text-gray-100">{record.fullName}</dd>
                    </div>
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3.5 dark:border-slate-800 dark:bg-slate-900">
                      <dt className="text-xs font-semibold uppercase text-gray-400">{t('emailLabel')}</dt>
                      <dd className="mt-1 font-medium text-gray-900 text-sm dark:text-gray-100">{record.email}</dd>
                    </div>
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3.5 dark:border-slate-800 dark:bg-slate-900">
                      <dt className="text-xs font-semibold uppercase text-gray-400">{t('roleLabel')}</dt>
                      <dd className="mt-1 font-medium text-gray-900 text-sm dark:text-gray-100">{translateStatusValue(t, 'users', 'role', record.role) || record.role}</dd>
                    </div>
                </dl>
                <div className="flex justify-end border-t border-gray-100 pt-4">
                  <Button variant="secondary" onClick={() => setMode(null)}>{t('backToListButton')}</Button>
                </div>
              </div>
            )
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {resource === 'farms' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('farmNameLabel')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={record.name || ''}
                      onChange={(e) => setRecord((cur) => ({ ...cur, name: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:border-green-400 dark:focus:bg-slate-900"
                      placeholder={t('farmNamePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('locationLabel')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={record.location || ''}
                      onChange={(e) => setRecord((cur) => ({ ...cur, location: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:border-green-400 dark:focus:bg-slate-900"
                      placeholder={t('locationPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('cropCurrentCropLabel')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      list="preset-crops-farm"
                      value={record.currentCrop || ''}
                      onChange={(e) => setRecord((cur) => ({ ...cur, currentCrop: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:border-green-400 dark:focus:bg-slate-900"
                      placeholder={t('cropCurrentCropPlaceholder')}
                    />
                    <datalist id="preset-crops-farm">
                      {PRESET_CROPS.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('sowingDateLabel')}
                    </label>
                    <input
                      type="date"
                      value={record.sowingDate || ''}
                      max={record.harvestingDate || undefined}
                      onChange={(e) => setRecord((cur) => ({ ...cur, sowingDate: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:border-green-400 dark:focus:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('harvestingDateLabel')}
                    </label>
                    <input
                      type="date"
                      value={record.harvestingDate || ''}
                      min={record.sowingDate || undefined}
                      onChange={(e) => setRecord((cur) => ({ ...cur, harvestingDate: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:border-green-400 dark:focus:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('areaLabel')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={record.area || ''}
                      onChange={(e) => setRecord((cur) => ({ ...cur, area: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:border-green-400 dark:focus:bg-slate-900"
                      placeholder={t('areaPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('waterSourceLabel')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      list="water-sources"
                      value={record.waterSource || ''}
                      onChange={(e) => setRecord((cur) => ({ ...cur, waterSource: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:border-green-400 dark:focus:bg-slate-900"
                      placeholder={t('waterSourcePlaceholder')}
                    />
                    <datalist id="water-sources">
                      {WATER_SOURCES.map((ws) => (
                        <option key={ws} value={ws} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('statusLabel')}
                    </label>
                    <select
                      value={record.status || 'Healthy'}
                      onChange={(e) => setRecord((cur) => ({ ...cur, status: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:border-green-400 dark:focus:bg-slate-900"
                    >
                      {FARM_STATUSES.map((st) => (
                        <option key={st} value={st}>{t(`farmStatus_${st}`)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {resource === 'crops' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('cropNameLabel')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      list="preset-crops-crop"
                      value={record.name || ''}
                      onChange={(e) => setRecord((cur) => ({ ...cur, name: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:border-green-400 dark:focus:bg-slate-900"
                      placeholder={t('cropNamePlaceholder')}
                    />
                    <datalist id="preset-crops-crop">
                      {PRESET_CROPS.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('assignedFarmLabel')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={record.farmId || ''}
                      onChange={(e) => {
                        const selectedFarm = farmsList.find(f => String(f.id || f.farmId) === String(e.target.value));
                        setRecord((cur) => ({
                          ...cur,
                          farmId: e.target.value,
                          farmerName: selectedFarm ? (selectedFarm.farmerName || selectedFarm.farmer || selectedFarm.owner) : cur.farmerName
                        }));
                      }}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:border-green-400 dark:focus:bg-slate-900"
                    >
                      <option value="" disabled>{t('selectFarmOption')}</option>
                      {farmsList.map((f) => (
                        <option key={f.id || f.farmId} value={f.id || f.farmId}>
                          {f.name || f.farmName} ({f.location || 'Kanpur'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('growthStageLabel')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={record.stage || 'Vegetative'}
                      onChange={(e) => setRecord((cur) => ({ ...cur, stage: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:border-green-400 dark:focus:bg-slate-900"
                    >
                      {GROWTH_STAGES.map((stg) => (
                        <option key={stg} value={stg}>{t(`growthStage_${stg}`)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('cropHealthLabel')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={record.health || 'Excellent'}
                      onChange={(e) => setRecord((cur) => ({ ...cur, health: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:border-green-400 dark:focus:bg-slate-900"
                    >
                      {CROP_HEALTHS.map((h) => (
                        <option key={h} value={h}>{t(`cropHealth_${h}`)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('plantingDateLabel')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={record.plantingDate || ''}
                      onChange={(e) => setRecord((cur) => ({ ...cur, plantingDate: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:border-green-400 dark:focus:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('expectedYieldLabel')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={record.expectedYield || ''}
                      onChange={(e) => setRecord((cur) => ({ ...cur, expectedYield: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:border-green-400 dark:focus:bg-slate-900"
                      placeholder={t('expectedYieldPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('statusLabel')}
                    </label>
                    <select
                      value={record.status || 'Active'}
                      onChange={(e) => setRecord((cur) => ({ ...cur, status: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:border-green-400 dark:focus:bg-slate-900"
                    >
                      {CROP_STATUSES.map((s) => (
                        <option key={s} value={s}>{t(`cropStatus_${s}`)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {resource === 'users' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('fullNameLabel')} *</label>
                    <input
                      type="text"
                      required
                      value={record.fullName || ''}
                      onChange={(e) => setRecord((cur) => ({ ...cur, fullName: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('emailLabel')} *</label>
                    <input
                      type="email"
                      required
                      value={record.email || ''}
                      onChange={(e) => setRecord((cur) => ({ ...cur, email: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('roleLabel')} *</label>
                    <select
                      required
                      value={record.role || 'Farm Manager'}
                      onChange={(e) => setRecord((cur) => ({ ...cur, role: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
                    >
                      <option value="Admin">{t('adminRole')}</option>
                      <option value="Farm Manager">{t('farmManagerRole')}</option>
                      <option value="Guest">{t('guestRole')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('phoneLabel')}</label>
                    <input
                      type="text"
                      value={record.phoneNumber || ''}
                      onChange={(e) => setRecord((cur) => ({ ...cur, phoneNumber: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <Button variant="secondary" type="button" onClick={() => setMode(null)}>
                  {t('cancelButton')}
                </Button>
                <Button type="submit" disabled={saving} className="px-6">
                  {saving
                    ? t('savingButton')
                    : resource === 'farms'
                    ? t('saveFarmButton')
                    : resource === 'crops'
                    ? t('saveCropButton')
                    : resource === 'users'
                    ? t('saveUserButton')
                    : `Save ${resource.slice(0, -1)}`}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {segmentKey && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter('All')}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
              filter === 'All'
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-400'
            }`}
          >
            {t('allFilterOption')} <span className="opacity-75">({scopedRecords.length})</span>
          </button>
          {filters.map((item) => {
            const value = typeof item === 'object' ? item.value : item;
            const label = typeof item === 'object' ? item.label : item;
            const count = segmentCounts[value] || 0;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  filter === value
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-400'
                }`}
              >
                {label} <span className="opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      <Card className="space-y-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-green-600">{t('operationsCenterEyebrow')}</p>
            <h2 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">{TITLE_KEY_MAP[title] ? t(TITLE_KEY_MAP[title]) : (title || `${resource} management`)}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">{t('recordsSubtitle')}</p>
          </div>
          {canAdd && (
            <Button onClick={openCreateModal}>
              <Plus className="mr-2 h-4 w-4" />
              {resource === 'farms' ? t('addFarm') : resource === 'crops' ? t('addCrop') : resource === 'users' ? t('addUserButton') : `Add ${resource.slice(0, -1)}`}
            </Button>
          )}
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_12rem]">
          <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              aria-label={`Search ${resource}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none placeholder:text-gray-400"
              placeholder={resource === 'farms' ? t('searchFarmsPlaceholder') : resource === 'crops' ? t('searchCropsPlaceholder') : resource === 'users' ? t('searchUsersPlaceholder') : `Search ${resource}...`}
            />
          </label>
          <select
            aria-label={`Filter ${resource}`}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300"
          >
            <option value="All">{t('allFilterOption')}</option>
            {filters.map((item) => (
              typeof item === 'object'
                ? <option key={item.value} value={item.value}>{item.label}</option>
                : <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        {resource === 'crops' ? (
          <CropsList
            rows={rows}
            getCropImage={getCropImage}
            onView={(item) => { setRecord(item); setMode('view'); }}
            t={t}
          />
        ) : resource === 'farms' ? (
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((item) => {
              const statusTone = ['Healthy', 'Excellent', 'Active'].includes(item.status)
                ? 'bg-green-50 text-green-700 border-green-200'
                : ['Needs Attention', 'Good', 'Average', 'Stable'].includes(item.status)
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-red-50 text-red-700 border-red-200';

              const cropName = String(item.currentCrop || item.crop || item.name || '').trim();
              const cropImage = getCropImage(cropName);
              let cropVisual = { emoji: '🌱', accent: 'from-green-100 via-emerald-50 to-lime-100' };

              if (cropName.toLowerCase().includes('potato')) {
                cropVisual = { emoji: '🥔', accent: 'from-amber-100 via-orange-50 to-yellow-100' };
              } else if (cropName.toLowerCase().includes('tomato')) {
                cropVisual = { emoji: '🍅', accent: 'from-red-100 via-rose-50 to-orange-100' };
              } else if (cropName.toLowerCase().includes('rice')) {
                cropVisual = { emoji: '🌾', accent: 'from-yellow-100 via-lime-50 to-green-100' };
              } else if (cropName.toLowerCase().includes('wheat')) {
                cropVisual = { emoji: '🌾', accent: 'from-amber-100 via-yellow-50 to-lime-100' };
              } else if (cropName.toLowerCase().includes('corn')) {
                cropVisual = { emoji: '🌽', accent: 'from-yellow-100 via-amber-50 to-orange-100' };
              } else if (cropName.toLowerCase().includes('cotton')) {
                cropVisual = { emoji: '🧵', accent: 'from-slate-100 via-zinc-50 to-emerald-100' };
              } else if (cropName.toLowerCase().includes('banana')) {
                cropVisual = { emoji: '🍌', accent: 'from-yellow-100 via-amber-50 to-green-100' };
              } else if (cropName.toLowerCase().includes('mango')) {
                cropVisual = { emoji: '🥭', accent: 'from-orange-100 via-amber-50 to-green-100' };
              } else if (cropName.toLowerCase().includes('apple')) {
                cropVisual = { emoji: '🍎', accent: 'from-rose-100 via-red-50 to-green-100' };
              }

              return (
                <div key={item.id || item.farmId || item.cropId} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-black">
                  <div className={`relative flex h-48 items-center justify-center overflow-hidden ${cropImage ? 'bg-gray-100' : `bg-gradient-to-br ${cropVisual.accent}`}`}>
                    {cropImage ? (
                      <img src={cropImage} alt={cropName || 'Crop'} className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.7),_transparent_45%)]" />
                    <div className="absolute inset-0 opacity-25" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"220\" height=\"220\" viewBox=\"0 0 220 220\"%3E%3Cpath fill=\"%232d4f2c\" d=\"M20 150c20-45 46-70 86-70 30 0 56 18 78 54-24 20-48 30-76 30-26 0-50-10-88-14z\"/%3E%3C/svg%3E")', backgroundSize: 'cover'}} />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
                      </>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
                    <div className="relative z-10 flex h-full w-full items-end justify-start p-4">
                      <div className="rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow-lg backdrop-blur-sm dark:border-slate-800/70 dark:bg-black/80">
                        {cropImage ? (
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{cropName || item.name || item.farmName || t('farmColumnLabel')}</p>
                        ) : (
                          <>
                            <div className="text-4xl leading-none">{cropVisual.emoji}</div>
                            <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-300">{item.name || item.farmName || t('farmColumnLabel')}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.name || item.farmName || t('farmFallbackName')}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">{item.location || t('locationNotAddedFallback')}</p>
                      </div>
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone}`}>
                        {translateStatusValue(t, 'farms', 'status', item.status || 'Healthy')}
                      </span>
                    </div>

                    {resource === 'farms' && item.location && (
                      <FarmWeatherBadge location={item.location} />
                    )}

                    <div className="grid gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-slate-800">
                        <span>{t('cropColumnLabel')}</span>
                        <span className="font-medium text-gray-800">{item.currentCrop || '—'}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-slate-800">
                        <span>{t('areaLabel').replace(/\s*\(.*\)$/, '')}</span>
                        <span className="font-medium text-gray-800">{item.area || '—'}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-slate-800">
                        <span>{t('waterSourceLabel')}</span>
                        <span className="font-medium text-gray-800">{item.waterSource || '—'}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        aria-label={`View ${resource.slice(0, -1)}`}
                        onClick={() => { setRecord(item); setMode('view'); }}
                        className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-slate-700 dark:text-gray-400 dark:hover:bg-slate-800"
                      >
                        {t('viewButton')}
                      </button>
                      {canEdit(item) && (
                        <button
                          type="button"
                          aria-label={`Edit ${resource.slice(0, -1)}`}
                          onClick={() => openEditModal(item)}
                          className="flex-1 rounded-lg border border-green-200 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
                        >
                          {t('editButton')}
                        </button>
                      )}
                      {canDelete(item) && (
                        <button
                          type="button"
                          aria-label={`Delete ${resource.slice(0, -1)}`}
                          onClick={() => { setRecord(item); setMode('delete'); }}
                          className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          {t('deleteButton')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {!rows.length && (
              <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-gray-500 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-500">
                {t('noRecordsFoundMessage')}
              </div>
            )}
          </div>
        ) : (
          <UsersList
            rows={rows}
            canEdit={canEdit}
            canDelete={canDelete}
            onEdit={openEditModal}
            onDelete={(item) => { setRecord(item); setMode('delete'); }}
            roleLabel={(role) => translateStatusValue(t, 'users', 'role', role) || role}
            t={t}
          />
        )}

        <div className="flex items-center justify-between gap-3 p-4 text-sm border-t border-gray-100">
          <span className="text-gray-500 dark:text-gray-500">{visibleRecords.length} {t('recordsCountLabel')}</span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" disabled={page === 1} onClick={() => setPage((v) => v - 1)} className="px-3 py-1.5 text-xs">
              {t('previousButton')}
            </Button>
            <span className="text-gray-600 text-xs font-medium dark:text-gray-400">{t('pageLabel')} {page} {t('ofLabel')} {pages}</span>
            <Button variant="secondary" disabled={page === pages} onClick={() => setPage((v) => v + 1)} className="px-3 py-1.5 text-xs">
              {t('nextButton')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};



