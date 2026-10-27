// store/apiSlice.js
// Complete RTK Query API slice connecting Uqaab React Native frontend
// to the FastAPI backend at /api/v1/...

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Use 10.0.2.2 for Android Emulator, or your Wi-Fi IP for a physical device
const BASE_URL = 'http://192.168.18.85:8000';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  // Tag types for cache invalidation
  tagTypes: [
    'Properties',
    'Dashboard',
    'Alerts',
    'Cameras',
    'Drones',
    'People',
    'FlightLogs',
    'FenceConfig',
    'FenceCells',
    'FaceDetection',
    'DetectionStatus',
  ],

  endpoints: (builder) => ({

    // ═══════════════════════════════════════════════════════
    // AUTH  →  /api/v1/auth/...
    // ═══════════════════════════════════════════════════════

    // POST /api/v1/auth/signup
    // Body: { full_name, email, password, confirm_password }
    // Returns: { success, message, user, token }
    signup: builder.mutation({
      query: (userData) => ({
        url: '/api/v1/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),

    // POST /api/v1/auth/login
    // Body: { email, password }
    // Returns: { success, message, user, token }
    login: builder.mutation({
      query: (credentials) => ({
        url: '/api/v1/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // GET /api/v1/auth/me   (requires Authorization header)
    // Returns: { success, message, user, token: null }
    getMe: builder.query({
      query: () => '/api/v1/auth/me',
    }),


    // ═══════════════════════════════════════════════════════
    // PROPERTIES  →  /api/v1/properties/...
    // ═══════════════════════════════════════════════════════

    // GET /api/v1/properties/
    // Returns: { success, message, properties: [...] }
    // Each property: { id, name, address, latitude, longitude,
    //   laser_grid: { x_lasers, y_lasers, box_width, box_length, grid_height },
    //   cameras_online, cameras_total, drone_status, active_alerts, created_at }
    getProperties: builder.query({
      query: () => '/api/v1/properties/',
      providesTags: ['Properties'],
    }),

    // GET /api/v1/properties/:id
    // Returns: { success, message, property: {...} }
    getProperty: builder.query({
      query: (propertyId) => `/api/v1/properties/${propertyId}`,
      providesTags: (result, error, id) => [{ type: 'Properties', id }],
    }),

    // POST /api/v1/properties/
    // Body: { name, address, latitude, longitude,
    //   laser_grid: { x_lasers, y_lasers, box_width, box_length, grid_height } }
    // Returns: { success, message, property: {...} }
    createProperty: builder.mutation({
      query: (propertyData) => ({
        url: '/api/v1/properties/',
        method: 'POST',
        body: propertyData,
      }),
      invalidatesTags: ['Properties'],
    }),

    // PUT /api/v1/properties/:id
    // Body: (any subset of createProperty body — all fields optional)
    // Returns: { success, message, property: {...} }
    updateProperty: builder.mutation({
      query: ({ propertyId, ...body }) => ({
        url: `/api/v1/properties/${propertyId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        'Properties',
        { type: 'Properties', id: propertyId },
      ],
    }),

    // DELETE /api/v1/properties/:id
    // Returns: { success, message }
    deleteProperty: builder.mutation({
      query: (propertyId) => ({
        url: `/api/v1/properties/${propertyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Properties'],
    }),


    // ═══════════════════════════════════════════════════════
    // DASHBOARD & ALERTS  →  /api/v1/dashboard/...
    // ═══════════════════════════════════════════════════════

    // GET /api/v1/dashboard/:propertyId
    // Returns: { success, message, property_name, active_alert,
    //   drone_status, cameras_online, cameras_total, new_alerts_count,
    //   cameras: [...], drones: [...], latitude, longitude }
    getDashboard: builder.query({
      query: (propertyId) => `/api/v1/dashboard/${propertyId}`,
      providesTags: (result, error, propertyId) => [
        { type: 'Dashboard', id: propertyId },
        { type: 'Alerts', id: propertyId },
      ],
    }),

    // GET /api/v1/dashboard/:propertyId/alerts?filter=all|new|active
    // Returns: { success, message, alerts: [...] }
    // Each alert: { id, type, camera_name, timestamp, is_read, confidence,
    //   severity, image_url, clip_url, camera_cell: { row, col }, status, detected_cell }
    getAlerts: builder.query({
      query: ({ propertyId, filter = 'all' }) =>
        `/api/v1/dashboard/${propertyId}/alerts?filter=${filter}`,
      providesTags: (result, error, { propertyId }) => [
        { type: 'Alerts', id: propertyId },
      ],
    }),

    // GET /api/v1/dashboard/alerts/:alertId
    // Returns: { success, message, alert: {...} }
    getAlert: builder.query({
      query: (alertId) => `/api/v1/dashboard/alerts/${alertId}`,
      providesTags: (result, error, alertId) => [{ type: 'Alerts', id: alertId }],
    }),

    // PUT /api/v1/dashboard/alerts/:alertId/read
    // Returns: { success, message }
    markAlertRead: builder.mutation({
      query: (alertId) => ({
        url: `/api/v1/dashboard/alerts/${alertId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, alertId) => [
        'Alerts',
        { type: 'Alerts', id: alertId },
      ],
    }),

    // PUT /api/v1/dashboard/alerts/:alertId/false-positive
    // Returns: { success, message }
    markAlertFalsePositive: builder.mutation({
      query: (alertId) => ({
        url: `/api/v1/dashboard/alerts/${alertId}/false-positive`,
        method: 'PUT',
      }),
      invalidatesTags: ['Alerts'],
    }),

    // PUT /api/v1/dashboard/alerts/:alertId/resolve
    // Returns: { success, message }
    resolveAlert: builder.mutation({
      query: (alertId) => ({
        url: `/api/v1/dashboard/alerts/${alertId}/resolve`,
        method: 'PUT',
      }),
      invalidatesTags: ['Alerts'],
    }),

    // DELETE /api/v1/dashboard/alerts/:alertId
    // Returns: { success, message }
    deleteAlert: builder.mutation({
      query: (alertId) => ({
        url: `/api/v1/dashboard/alerts/${alertId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Alerts'],
    }),

    // PUT /api/v1/dashboard/:propertyId/drone-status  (toggle drone ON/OFF)
    // Returns: { success, message }
    toggleDroneStatus: builder.mutation({
      query: (propertyId) => ({
        url: `/api/v1/dashboard/${propertyId}/drone-status`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, propertyId) => [
        { type: 'Dashboard', id: propertyId },
      ],
    }),


    // ═══════════════════════════════════════════════════════
    // SETTINGS – CAMERAS  →  /api/v1/settings/...
    // ═══════════════════════════════════════════════════════

    // GET /api/v1/settings/:propertyId/cameras
    // Returns: { success, message, cameras: [...] }
    // Each camera: { id, name, rtsp_url, camera_type, grid_cell: { row, col } }
    getCameras: builder.query({
      query: (propertyId) => `/api/v1/settings/${propertyId}/cameras`,
      providesTags: (result, error, propertyId) => [
        { type: 'Cameras', id: propertyId },
      ],
    }),

    // POST /api/v1/settings/:propertyId/cameras
    // Body: { name, rtsp_url, camera_type: "entrance"|"insider"|"fence",
    //   grid_cell: { row, col } }
    // Returns: { success, message, camera_id }
    createCamera: builder.mutation({
      query: ({ propertyId, ...body }) => ({
        url: `/api/v1/settings/${propertyId}/cameras`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: 'Cameras', id: propertyId },
      ],
    }),

    // PUT /api/v1/settings/cameras/:cameraId
    // Body: (any subset — all optional) { name, rtsp_url, camera_type, grid_cell }
    // Returns: { success, message }
    updateCamera: builder.mutation({
      query: ({ cameraId, propertyId, ...body }) => ({
        url: `/api/v1/settings/cameras/${cameraId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: 'Cameras', id: propertyId },
      ],
    }),

    // DELETE /api/v1/settings/cameras/:cameraId
    // Returns: { success, message }
    deleteCamera: builder.mutation({
      query: ({ cameraId, propertyId }) => ({
        url: `/api/v1/settings/cameras/${cameraId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: 'Cameras', id: propertyId },
      ],
    }),


    // ═══════════════════════════════════════════════════════
    // SETTINGS – DRONES  →  /api/v1/settings/...
    // ═══════════════════════════════════════════════════════

    // GET /api/v1/settings/:propertyId/drones
    // Returns: { success, message, drones: [...] }
    // Each drone: { id, name, connection_string, status, home_cell: { row, col } }
    getDrones: builder.query({
      query: (propertyId) => `/api/v1/settings/${propertyId}/drones`,
      providesTags: (result, error, propertyId) => [
        { type: 'Drones', id: propertyId },
      ],
    }),

    // POST /api/v1/settings/:propertyId/drones
    // Body: { name, connection_string, home_cell: { row, col } }
    // Returns: { success, message }
    createDrone: builder.mutation({
      query: ({ propertyId, ...body }) => ({
        url: `/api/v1/settings/${propertyId}/drones`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: 'Drones', id: propertyId },
      ],
    }),

    // PUT /api/v1/settings/drones/:droneId
    // Body: (any subset) { name, connection_string, home_cell }
    // Returns: { success, message }
    updateDrone: builder.mutation({
      query: ({ droneId, propertyId, ...body }) => ({
        url: `/api/v1/settings/drones/${droneId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: 'Drones', id: propertyId },
      ],
    }),

    // DELETE /api/v1/settings/drones/:droneId
    // Returns: { success, message }
    deleteDrone: builder.mutation({
      query: ({ droneId, propertyId }) => ({
        url: `/api/v1/settings/drones/${droneId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: 'Drones', id: propertyId },
      ],
    }),


    // ═══════════════════════════════════════════════════════
    // SETTINGS – AUTHORIZED PEOPLE  →  /api/v1/settings/...
    // ═══════════════════════════════════════════════════════

    // GET /api/v1/settings/:propertyId/people
    // Returns: { success, message, people: [...] }
    // Each person: { id, name, role, photo_urls: [...] }
    getPeople: builder.query({
      query: (propertyId) => `/api/v1/settings/${propertyId}/people`,
      providesTags: (result, error, propertyId) => [
        { type: 'People', id: propertyId },
      ],
    }),

    // POST /api/v1/settings/:propertyId/people
    // Body: { name, role: "Guard"|"Guest"|"Authorized Person", photo_urls: [...] }
    // Returns: { success, message }
    createPerson: builder.mutation({
      query: ({ propertyId, ...body }) => ({
        url: `/api/v1/settings/${propertyId}/people`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: 'People', id: propertyId },
      ],
    }),

    // PUT /api/v1/settings/people/:personId
    // Body: (any subset) { name, role, photo_urls }
    // Returns: { success, message }
    updatePerson: builder.mutation({
      query: ({ personId, propertyId, ...body }) => ({
        url: `/api/v1/settings/people/${personId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: 'People', id: propertyId },
      ],
    }),

    // DELETE /api/v1/settings/people/:personId
    // Returns: { success, message }
    deletePerson: builder.mutation({
      query: ({ personId, propertyId }) => ({
        url: `/api/v1/settings/people/${personId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: 'People', id: propertyId },
      ],
    }),

    // POST /api/v1/settings/upload-person-image
    // Body: FormData with key "file" (multipart/form-data)
    // Returns: { url: "/uploads/people/xxx.jpg" }
    uploadPersonImage: builder.mutation({
      query: (formData) => ({
        url: '/api/v1/settings/upload-person-image',
        method: 'POST',
        body: formData,
        // Let fetch set Content-Type automatically for FormData
        formData: true,
      }),
    }),

    // GET /api/v1/settings/roles
    // Returns: { success, roles: ["Guard","Guest","Authorized Person"] }
    getRoles: builder.query({
      query: () => '/api/v1/settings/roles',
    }),


    // ═══════════════════════════════════════════════════════
    // SETTINGS – FLIGHT LOGS  →  /api/v1/settings/...
    // ═══════════════════════════════════════════════════════

    // GET /api/v1/settings/:propertyId/flight-logs
    // Returns: { success, message, flight_logs: [...] }
    // Each log: { id, drone_name, type, takeoff_time, land_time }
    getFlightLogs: builder.query({
      query: (propertyId) => `/api/v1/settings/${propertyId}/flight-logs`,
      providesTags: (result, error, propertyId) => [
        { type: 'FlightLogs', id: propertyId },
      ],
    }),


    // ═══════════════════════════════════════════════════════
    // FENCE CONFIG  →  /api/v1/fence-config/...
    // ═══════════════════════════════════════════════════════

    // GET /api/v1/fence-config/cameras/:cameraId/fence-config
    // Returns: { id, camera_id, polygon_points: [{x,y},...], is_active }
    getFenceConfig: builder.query({
      query: (cameraId) =>
        `/api/v1/fence-config/cameras/${cameraId}/fence-config`,
      providesTags: (result, error, cameraId) => [
        { type: 'FenceConfig', id: cameraId },
      ],
    }),

    // POST /api/v1/fence-config/cameras/:cameraId/fence-config
    // Body: [ { x: float, y: float }, ... ]  (array of Point objects)
    // Returns: { id, camera_id, polygon_points, is_active }
    saveFenceConfig: builder.mutation({
      query: ({ cameraId, points }) => ({
        url: `/api/v1/fence-config/cameras/${cameraId}/fence-config`,
        method: 'POST',
        body: points,
      }),
      invalidatesTags: (result, error, { cameraId }) => [
        { type: 'FenceConfig', id: cameraId },
      ],
    }),

    // DELETE /api/v1/fence-config/cameras/:cameraId/fence-config
    // Returns: { success, message }
    deleteFenceConfig: builder.mutation({
      query: (cameraId) => ({
        url: `/api/v1/fence-config/cameras/${cameraId}/fence-config`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, cameraId) => [
        { type: 'FenceConfig', id: cameraId },
        { type: 'FenceCells', id: cameraId },
      ],
    }),

    // GET /api/v1/fence-config/cameras/:cameraId/cells
    // Returns: { success, message, cells: [...] }
    // Each cell: { id, camera_id, cell_name, row, col, polygon_points }
    getFenceCells: builder.query({
      query: (cameraId) =>
        `/api/v1/fence-config/cameras/${cameraId}/cells`,
      providesTags: (result, error, cameraId) => [
        { type: 'FenceCells', id: cameraId },
      ],
    }),

    // POST /api/v1/fence-config/cameras/:cameraId/cells
    // Body: { cells: [{ cell_name, row, col, polygon_points: [{x,y},...] }] }
    // Returns: { success, message, cells: [...] }
    saveFenceCells: builder.mutation({
      query: ({ cameraId, cells }) => ({
        url: `/api/v1/fence-config/cameras/${cameraId}/cells`,
        method: 'POST',
        body: { cells }, // <--- PUT THE CURLY BRACES BACK HERE!
      }),
      invalidatesTags: (result, error, { cameraId }) => [
        { type: 'FenceCells', id: cameraId },
      ],
    }),

    // DELETE /api/v1/fence-config/cameras/:cameraId/cells
    // Returns: { success, message }
    deleteFenceCells: builder.mutation({
      query: (cameraId) => ({
        url: `/api/v1/fence-config/cameras/${cameraId}/cells`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, cameraId) => [
        { type: 'FenceCells', id: cameraId },
      ],
    }),


    // ═══════════════════════════════════════════════════════
    // FACE DETECTION  →  /api/v1/face-detection/...
    // ═══════════════════════════════════════════════════════

    // GET /api/v1/face-detection/:propertyId/events?limit=100&only_unauthorized=false
    // Returns: { success, count, events: [...] }
    getFaceEvents: builder.query({
      query: ({ propertyId, limit = 100, onlyUnauthorized = false }) =>
        `/api/v1/face-detection/${propertyId}/events?limit=${limit}&only_unauthorized=${onlyUnauthorized}`,
      providesTags: (result, error, { propertyId }) => [
        { type: 'FaceDetection', id: propertyId },
      ],
    }),

    // POST /api/v1/face-detection/encode-person
    // Body: { person_id: int }
    // Returns: { success, message, person_id, encodings_count }
    encodePerson: builder.mutation({
      query: (personId) => ({
        url: '/api/v1/face-detection/encode-person',
        method: 'POST',
        body: { person_id: personId },
      }),
    }),

    // GET /api/v1/face-detection/status
    // Returns: { success, running_cameras: { camera_id: bool } }
    getFaceDetectionStatus: builder.query({
      query: () => '/api/v1/face-detection/status',
    }),

    // POST /api/v1/face-detection/cameras/:cameraId/start
    startFaceDetection: builder.mutation({
      query: (cameraId) => ({
        url: `/api/v1/face-detection/cameras/${cameraId}/start`,
        method: 'POST',
      }),
    }),

    // POST /api/v1/face-detection/cameras/:cameraId/stop
    stopFaceDetection: builder.mutation({
      query: (cameraId) => ({
        url: `/api/v1/face-detection/cameras/${cameraId}/stop`,
        method: 'POST',
      }),
    }),


    // ═══════════════════════════════════════════════════════
    // CAMERA STREAM  →  /api/v1/stream/...
    // ═══════════════════════════════════════════════════════
    //
    // NOTE: Live streams (/api/v1/stream/:cameraId/live) and single frames
    // (/api/v1/stream/:cameraId/frame) are used as direct URLs in <WebView>
    // or <Image> components — NOT via RTK Query.
    //
    // Live MJPEG stream URL (use in WebView):
    //   `${BASE_URL}/api/v1/stream/${cameraId}/live`  (requires auth header,
    //   pass token as query param if WebView cannot set headers)
    //
    // Single frame URL (use in Image):
    //   `${BASE_URL}/api/v1/stream/${cameraId}/frame`
    //
    // POST /api/v1/stream/preview-frame — preview from RTSP URL before saving camera
    // Body: { rtsp_url: string }
    // Returns: image/jpeg bytes (use as blob/base64 in UI)
    getStreamPreviewFrame: builder.mutation({
      query: (rtspUrl) => ({
        url: '/api/v1/stream/preview-frame',
        method: 'POST',
        body: { rtsp_url: rtspUrl },
        responseHandler: async (response) => {
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        },
      }),
    }),

    // ═══════════════════════════════════════════════════════
    // YOLO DETECTION MANAGER  →  /api/v1/detection/...
    // ═══════════════════════════════════════════════════════

    // GET /api/v1/detection/status
    getDetectionStatus: builder.query({
      query: () => '/api/v1/detection/status',
      providesTags: ['DetectionStatus'],
    }),

    // POST /api/v1/detection/:cameraId/start
    startDetection: builder.mutation({
      query: (cameraId) => ({
        url: `/api/v1/detection/${cameraId}/start`,
        method: 'POST',
      }),
      invalidatesTags: ['DetectionStatus'],
    }),

    // POST /api/v1/detection/:cameraId/stop
    stopDetection: builder.mutation({
      query: (cameraId) => ({
        url: `/api/v1/detection/${cameraId}/stop`,
        method: 'POST',
      }),
      invalidatesTags: ['DetectionStatus'],
    }),

    // POST /api/v1/detection/:cameraId/restart
    restartDetection: builder.mutation({
      query: (cameraId) => ({
        url: `/api/v1/detection/${cameraId}/restart`,
        method: 'POST',
      }),
      invalidatesTags: ['DetectionStatus'],
    }),


  }),
});

// ─── Export hooks ────────────────────────────────────────────────────────────

export const {
  // Auth
  useSignupMutation,
  useLoginMutation,
  useGetMeQuery,

  // Properties
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,

  // Dashboard & Alerts
  useGetDashboardQuery,
  useGetAlertsQuery,
  useGetAlertQuery,
  useMarkAlertReadMutation,
  useMarkAlertFalsePositiveMutation,
  useResolveAlertMutation,
  useDeleteAlertMutation,
  useToggleDroneStatusMutation,

  // Cameras
  useGetCamerasQuery,
  useCreateCameraMutation,
  useUpdateCameraMutation,
  useDeleteCameraMutation,

  // Drones
  useGetDronesQuery,
  useCreateDroneMutation,
  useUpdateDroneMutation,
  useDeleteDroneMutation,

  // People
  useGetPeopleQuery,
  useCreatePersonMutation,
  useUpdatePersonMutation,
  useDeletePersonMutation,
  useUploadPersonImageMutation,
  useGetRolesQuery,

  // Flight Logs
  useGetFlightLogsQuery,

  // Fence Config
  useGetFenceConfigQuery,
  useSaveFenceConfigMutation,
  useDeleteFenceConfigMutation,
  useGetFenceCellsQuery,
  useSaveFenceCellsMutation,
  useDeleteFenceCellsMutation,

  // Face Detection
  useGetFaceEventsQuery,
  useEncodePersonMutation,
  useGetFaceDetectionStatusQuery,
  useStartFaceDetectionMutation,
  useStopFaceDetectionMutation,

  // Stream
  useGetStreamPreviewFrameMutation,
  // ADD THESE NEW ONES:
  useGetDetectionStatusQuery,
  useStartDetectionMutation,
  useStopDetectionMutation,
  useRestartDetectionMutation,
} = apiSlice;

// Helper: build a live MJPEG stream URL for WebView (no RTK Query needed)
export const getLiveStreamUrl = (cameraId) =>
  `${BASE_URL}/api/v1/stream/${cameraId}/live`;

// Helper: build a single-frame URL for Image component
export const getFrameUrl = (cameraId) =>
  `${BASE_URL}/api/v1/stream/${cameraId}/frame`;