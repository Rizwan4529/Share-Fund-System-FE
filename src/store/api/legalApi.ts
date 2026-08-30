import { baseApi } from "@/store/api/baseApi";
import type {
  CreateLegalDocumentRequest,
  LegalAcceptance,
  LegalAcceptanceCurrent,
  LegalDocument,
  LegalDocumentType,
  PublishLegalDocumentRequest,
  RecordLegalAcceptanceRequest,
  UpdateLegalDocumentRequest,
} from "@/types/auth";
import { API_PATHS } from "@/utils/constants";

export const legalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listLegalDocuments: builder.query<LegalDocument[], void>({
      query: () => API_PATHS.LEGAL_DOCUMENTS,
      providesTags: (result) =>
        result
          ? [
              ...result.map((document) => ({
                type: "LegalDocument" as const,
                id: document.documentType,
              })),
              { type: "LegalDocument", id: "LIST" },
            ]
          : [{ type: "LegalDocument", id: "LIST" }],
    }),
    getLegalDocument: builder.query<LegalDocument, LegalDocumentType>({
      query: (documentType) => API_PATHS.LEGAL_DOCUMENT(documentType),
      providesTags: (_result, _error, documentType) => [
        { type: "LegalDocument", id: documentType },
      ],
    }),
    listLegalDocumentVersions: builder.query<LegalDocument[], LegalDocumentType>(
      {
        query: (documentType) => API_PATHS.LEGAL_DOCUMENT_VERSIONS(documentType),
        providesTags: (_result, _error, documentType) => [
          { type: "LegalDocument", id: documentType },
          { type: "LegalDocument", id: "LIST" },
        ],
      },
    ),
    getLegalDocumentVersion: builder.query<
      LegalDocument,
      { documentType: LegalDocumentType; version: number }
    >({
      query: ({ documentType, version }) =>
        API_PATHS.LEGAL_DOCUMENT_VERSION(documentType, version),
      providesTags: (_result, _error, { documentType }) => [
        { type: "LegalDocument", id: documentType },
      ],
    }),
    createLegalDocument: builder.mutation<
      LegalDocument,
      CreateLegalDocumentRequest
    >({
      query: (body) => ({
        url: API_PATHS.LEGAL_DOCUMENTS,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { documentType }) => [
        { type: "LegalDocument", id: documentType },
        { type: "LegalDocument", id: "LIST" },
      ],
    }),
    updateLegalDocument: builder.mutation<
      LegalDocument,
      { documentType: LegalDocumentType } & UpdateLegalDocumentRequest
    >({
      query: ({ documentType, ...body }) => ({
        url: API_PATHS.LEGAL_DOCUMENT(documentType),
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { documentType }) => [
        { type: "LegalDocument", id: documentType },
        { type: "LegalDocument", id: "LIST" },
      ],
    }),
    publishLegalDocument: builder.mutation<
      LegalDocument,
      PublishLegalDocumentRequest
    >({
      query: ({ documentType, version, effectiveDate }) => ({
        url: API_PATHS.LEGAL_DOCUMENT_PUBLISH(documentType, version),
        method: "PATCH",
        body: effectiveDate ? { effectiveDate } : {},
      }),
      invalidatesTags: (_result, _error, { documentType }) => [
        { type: "LegalDocument", id: documentType },
        { type: "LegalDocument", id: "LIST" },
      ],
    }),
    getMyLegalAcceptances: builder.query<LegalAcceptance[], void>({
      query: () => API_PATHS.LEGAL_ACCEPTANCES_ME,
      providesTags: [{ type: "LegalAcceptance", id: "LIST" }],
    }),
    getMyCurrentAcceptance: builder.query<
      LegalAcceptanceCurrent,
      LegalDocumentType
    >({
      query: (documentType) => API_PATHS.LEGAL_ACCEPTANCE_CURRENT(documentType),
      providesTags: (_result, _error, documentType) => [
        { type: "LegalAcceptance", id: documentType },
      ],
    }),
    recordAcceptance: builder.mutation<unknown, RecordLegalAcceptanceRequest>({
      query: (body) => ({
        url: API_PATHS.LEGAL_ACCEPTANCES,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { documentType }) => [
        { type: "LegalAcceptance", id: documentType },
        { type: "LegalAcceptance", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListLegalDocumentsQuery,
  useGetLegalDocumentQuery,
  useListLegalDocumentVersionsQuery,
  useGetLegalDocumentVersionQuery,
  useCreateLegalDocumentMutation,
  useUpdateLegalDocumentMutation,
  usePublishLegalDocumentMutation,
  useGetMyLegalAcceptancesQuery,
  useGetMyCurrentAcceptanceQuery,
  useRecordAcceptanceMutation,
} = legalApi;
