import { Language } from '../types';

export const GS_PER_USD = 5890;
export const GS_PER_BRL = 1140;

export interface Translations {
  flag: string;
  flagLabel: string;
  currency: string;
  currencyLabel: string;
  formatCurrency: (amount: number) => string;

  // Navbar
  searchPlaceholder: string;
  cartLabel: string;
  announcement: string;
  languageLabel: string;

  // Hero
  heroEyebrow: string;
  ritualCleanse: string;
  ritualTreat: string;
  ritualHydrate: string;
  ritualProtect: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  heroCtaQuiz: string;
  heroCtaCatalog: string;
  heroTagline: string;
  officialBrands: string;

  // Catalog
  catalogTitle: string;
  catalogSubtitle: string;
  catalogError: string;
  catalogErrorHint: string;
  catalogEmpty: string;
  catalogEmptyHint: string;
  catalogRetry: string;
  catalogResetFilters: string;
  filterAll: string;
  filterSkin: string;
  filterPrice: string;
  filterBrand: string;
  filterPriceAll: string;
  priceUpTo: string;
  priceOver: string;
  skinGrasa: string;
  skinSeca: string;
  skinMixta: string;
  skinSensible: string;
  exploreByNeed: string;
  productsCount: string;

  // Routines
  routinesTitle: string;
  routinesSubtitle: string;
  routinesStep: string;

  // How it works
  howTitle: string;
  howSubtitle: string;
  howIntro: string;
  howStep1Title: string;
  howStep1Desc: string;
  howStep2Title: string;
  howStep2Desc: string;
  howStep3Title: string;
  howStep3Desc: string;
  howStep3Label1: string;
  howStep3Label2: string;
  howStep4Title: string;
  howStep4Desc: string;

  // Footer
  footerOriginalTitle: string;
  footerOriginalDesc: string;
  footerDeliveryTitle: string;
  footerDeliveryDesc: string;
  footerWhatsTitle: string;
  footerWhatsDesc: string;
  footerOrdered: string;
  footerTrack: string;
  footerFollow: string;
  footerContact: string;
  footerRights: string;
  footerKbeauty: string;
  footerKbeautyTail: string;

  // Cart drawer
  cartEmptyTitle: string;
  cartEmptyDesc: string;
  cartExplore: string;
  cartClear: string;
  cartClearTitle: string;
  cartNameLabel: string;
  cartNamePlaceholder: string;
  cartPhoneLabel: string;
  cartAddressLabel: string;
  cartAddressPlaceholder: string;
  cartMapsPlaceholder: string;
  cartMapsHint: string;
  cartMapsToggleAdd: string;
  cartMapsToggleHide: string;
  cartSubtotal: string;
  cartShipping: string;
  shippingToConfirm: string;
  cartShippingOptional: string;
  cartShippingHint: string;
  cartTotal: string;
  cartShippingMode: string;
  cartStockVerified: string;
  cartOfficialCare: string;
  cartDecrease: string;
  cartIncrease: string;
  cartFillData: string;
  cartFillDataDesc: string;
  cartLoginRequired: string;
  cartNoStock: string;
  cartWait: string;
  cartWaitDesc: string;
  cartEmptyError: string;
  cartEmptyErrorDesc: string;
  cartSyncError: string;
  cartWhatsAppFallback: string;
  errName: string;
  errUnexpected: string;
  errPhone: string;
  errAddress: string;

  // Order confirmation
  orderSuccessTitle: string;
  orderCode: string;
  orderCopyCode: string;
  orderWhatsTitle: string;
  orderWhatsDesc: string;
  orderPayTitle: string;
  orderPayDesc: string;
  orderDeliveryTitle: string;
  orderDeliveryDesc: string;
  orderItems: string;
  orderShipping: string;
  orderTotal: string;
  orderDestination: string;
  orderReopenWhats: string;

  // Tracking
  trackTitle: string;
  trackCodeLabel: string;
  trackNotFound: string;
  trackCancelled: string;
  trackShippingTo: string;
  trackTotal: string;
  trackMapTitle: string;
  trackMapCta: string;

  // Reviews
  reviewsTitle: string;
  reviewsLeave: string;
  reviewsBasedOn: string;
  reviewsCount: string;
  reviewsSingle: string;
  reviewsSortHelpful: string;
  reviewsSortRecent: string;
  reviewsEmpty: string;
  reviewsShowAll: string;
  reviewsVerified: string;
  reviewsHelpful: string;
  reviewsAskHelpful: string;
  reviewsAttribution: string;
  officialStore: string;
  followStore: string;
  followingStore: string;
  reviewsLeaveTitle: string;
  reviewsPhoto: string;
  skinTypeOily: string;
  skinTypeDry: string;
  skinTypeCombo: string;
  skinTypeSensitive: string;
  skinTypeNormal: string;

  // Review form
  reviewFormTitle: string;
  reviewFormQ1: string;
  reviewFormQ2: string;
  reviewFormQ3: string;
  reviewFormQ3Hint: string;
  reviewFormQ5: string;
  reviewFormPlaceholder: string;
  reviewFormSubmit: string;
  reviewFormSubmitting: string;
  reviewFormThanks: string;
  reviewFormThanksDesc: string;
  reviewFormMaxPhotos: string;
  reviewFormPhotoError: string;
  reviewFormRatingError: string;
  reviewFormAuthError: string;
  reviewFormCommentError: string;
  reviewFormSaveError: string;
  reviewFormAlreadySent: string;
  reviewGrasa: string;
  reviewSeca: string;
  reviewMixta: string;
  reviewSensible: string;

  // Star rating
  starVeryBad: string;
  starBad: string;
  starRegular: string;
  starGood: string;
  starExcellent: string;
  starAria: string;
  starHint: string;
  starCount: string;

  // Google auth
  authReviewAs: string;
  authLogout: string;
  authContinue: string;
  authPrivacy: string;

  // Diagnostic quiz
  quizClose: string;
  quizTitle: string;
  quizStep: string;
  quizStepOf: string;
  quizContinue: string;
  quizQ1Sub: string;
  quizOptionOily: string;
  quizOptionOilyDesc: string;
  quizOptionCombo: string;
  quizOptionComboDesc: string;
  quizOptionDry: string;
  quizOptionDryDesc: string;
  quizOptionSensitive: string;
  quizOptionSensitiveDesc: string;
  quizQ2Title: string;
  quizQ2Sub: string;
  quizConcernAcne: string;
  quizConcernAcneDesc: string;
  quizConcernSpots: string;
  quizConcernSpotsDesc: string;
  quizConcernLines: string;
  quizConcernLinesDesc: string;
  quizConcernDehydr: string;
  quizConcernDehydrDesc: string;
  quizConcernRedness: string;
  quizConcernRednessDesc: string;
  quizQ3Sub: string;
  quizRoutineBasic: string;
  quizRoutineBasicDesc: string;
  quizRoutineComplete: string;
  quizRoutineCompleteDesc: string;
  quizRoutineAdvanced: string;
  quizRoutineAdvancedDesc: string;
  quizQ4Sub: string;
  quizQ4Daily: string;
  quizResultTitle: string;
  quizRestart: string;
  quizRoutineOily: string;
  quizRoutineSensitive: string;
  quizRoutineSpots: string;
  quizRoutineAntiAge: string;
  quizRoutineUniversal: string;

  // Saved quiz banner
  savedHide: string;
  savedTitle: string;
  savedDesc: string;
  savedRedo: string;
  savedGrasa: string;
  savedMixta: string;
  savedSeca: string;
  savedSensible: string;

  // Welcome popup
  welcomeTitle: string;
  welcomeDesc: string;
  welcomeCta: string;

  // Premium
  premiumTitle: string;
  premiumSubtitle: string;
  premiumCancel: string;

  // Install banner
  installAria: string;
  installIos: string;
  installDesc: string;

  // Floating cart
  floatingCartAria: string;

  // Error boundary
  errorSection: string;

  // Mobile bottom nav
  navHome: string;
  navSearch: string;
  navCart: string;
  navAdvice: string;
  navAccount: string;
  navAria: string;
  navWhatsMessage: string;

  // Admin (gates only)
  adminZone: string;
  adminLoginHint: string;

  // App
  appErrorTitle: string;
  appErrorDesc: string;
  appErrorDetail: string;
  appErrorReload: string;
  appReviewSent: string;
  appReviewSentDesc: string;
  appReviewRedirect: string;

  // Tracking steps
  stepReceived: string;
  stepPaid: string;
  stepShipped: string;
  stepDelivered: string;

  // Testimonios
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  testimonialsAria: string;

  // Cart / checkout (pass 2)
  cartTitle: string;
  cartClose: string;
  cartPhonePlaceholder: string;
  cartRemoveTitle: string;
  cartRemoveItem: string;
  cartUnitPrice: string;
  cartProductsCount: string;
  cartOptional: string;
  cartShippingCoord: string;
  cartShippingFrom: string;
  cartPreparing: string;
  cartOrderCta: string;
  cartPayTransfer: string;
  cartUnavailable: string;
  cartOrderError: string;
  cartOrderErrorDesc: string;
  cartOrderRegistered: string;
  pedErrEmpty: string;
  pedErrCustomerData: string;
  pedErrAuth: string;
  pedErrStock: string;
  pedErrUnavailable: string;
  pedErrFailed: string;

  // Order confirmation (pass 2)
  orderThanks: string;
  orderPrepared: string;
  orderClose: string;
  orderStepsTitle: string;
  orderSummary: string;
  orderRecipient: string;
  orderTrackLive: string;
  orderShareExp: string;

  // Quiz (pass 2)
  quizQ1Title: string;
  quizQ3Title: string;
  quizQ4Title: string;
  quizConcernPores: string;
  quizConcernPoresDesc: string;
  quizQ4DailyDesc: string;
  quizQ4SometimesLabel: string;
  quizQ4SometimesDesc: string;
  quizQ4MakeupLabel: string;
  quizQ4MakeupDesc: string;
  quizQ4NeverLabel: string;
  quizQ4NeverDesc: string;
  quizBack: string;
  quizAnalyzing: string;
  quizViewRoutine: string;
  quizBasedOn: string;
  quizStepsForSkin: string;
  quizViewFull: string;
  quizWhatsCta: string;
  savedReadySuffix: string;
  savedDiagnosed: string;

  // Counts / misc
  productCountOne: string;
  productCountOther: string;
  viewOrder: string;
  trackLoading: string;
  commonClose: string;
  mapsLinkLabel: string;

  // Toast (pass 2)
  toastWhatsCta: string;
  toastClose: string;

  // Tracking (pass 2)
  trackViewBtn: string;
  trackAutoRefresh: string;
  trackCurrentState: string;
  trackYourZone: string;
  trackZoneApprox: string;

  // Reviews (pass 2)
  reviewSortBest: string;
  reviewSortWorst: string;
  reviewCountOne: string;
  reviewCountOther: string;
  reviewPhotoLarge: string;
  reviewPhotoExpanded: string;
  reviewPhotosStep: string;
  reviewPhotosHint: string;
  reviewLoginPhotos: string;
  reviewRemovePhoto: string;
  reviewNormal: string;
  reviewPhotoSize: string;
  reviewSortBy: string;
  reviewsClearFilters: string;
  reviewsWithFilters: string;
  reviewReplyBadge: string;

  // Routines (pass 2)
  routinesError: string;
  routinesNoTable: string;
  routinesBadStructure: string;
  routineAddedMsg: string;
  routineAddCta: string;
  routineFullLabel: string;
  viewDetailsOf: string;
  routinesNone: string;
  viewRoutineAria: string;
  routinesCauses: string;
  routinesRls: string;
  routinesBadge: string;

  // Premium
  premiumPlanBadge: string;
  premiumB1: string;
  premiumB2: string;
  premiumB3: string;
  premiumB4: string;
  premiumSubscribe: string;

  // Product card / quick view / nav a11y (pass 2)
  wishlistRemove: string;
  wishlistSave: string;
  productDetails: string;
  addToOrderAria: string;
  quickViewClose: string;
  quickViewPrev: string;
  quickViewNext: string;
  quickViewZoomTitle: string;
  quickViewZoomClose: string;
  newArrival: string;
  leaveReview: string;
  addedExclaim: string;
  navClearSearch: string;
  navOpenOrder: string;
  navOpenOrderItems: string;
  navChangeLanguage: string;
  navSwitchTo: string;
  navLanguageHeader: string;
  installHide: string;
  authSignInGoogle: string;
  reviewFormClose: string;
  toastRegion: string;
  blogBack: string;
  blogReadingTime: string;
  blogFaqTitle: string;
}

type TranslationsMap = Record<Language, Translations>;
