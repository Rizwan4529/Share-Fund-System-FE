import { baseApi } from "@/store/api/baseApi";
import type {
  LegalAcceptanceCurrent,
  LegalDocument,
  LegalDocumentType,
  RecordLegalAcceptanceRequest,
} from "@/types/auth";
import { API_PATHS } from "@/utils/constants";

export const legalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLegalDocument: builder.query<LegalDocument, LegalDocumentType>({
      query: (documentType) => API_PATHS.LEGAL_DOCUMENT(documentType),
      providesTags: (_result, _error, documentType) => [
        { type: "LegalDocument", id: documentType },
      ],
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
      ],
    }),
  }),
});

export const {
  useGetLegalDocumentQuery,
  useGetMyCurrentAcceptanceQuery,
  useRecordAcceptanceMutation,
} = legalApi;
