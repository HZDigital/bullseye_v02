import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  LEVER_DATA,
  type DocLever,
} from "@/components/data/lever-data";
import { getTopRecommendedLevers } from "@/components/utils/lever-sort";

// Types
export interface SelectedDimension {
  title: string;
  section: string;
  dimension: string;
}

export interface FilterState {
  implementationTime: string | null;
  materialDescription: string | null;
  typeOfMaterial: string | null;
  details: string | null;
  esg: string | null;
  numberOfSuppliers: string | null;
  supplierPower: string | null;
  commodityPriceTrend: string | null;
  supplyChainComplexity: string | null;
  geographicSourcingStrategy: string | null;
  leadTime: string | null;
}

export interface KPIState {
  valueCreation: string[];
  sustainability: string[];
  resilience: string[];
}

// Define a variant state interface to hold all variant-specific data
export interface VariantState {
  cartItems: DocLever[];
  filters: FilterState;
  kpis: KPIState;
  selectedCategories: string[];
}

// Default state for a new variant
const createDefaultVariantState = (): VariantState => ({
  cartItems: [],
  filters: {
    implementationTime: null,
    materialDescription: null,
    typeOfMaterial: null,
    details: null,
    esg: null,
    numberOfSuppliers: null,
    supplierPower: null,
    commodityPriceTrend: null,
    supplyChainComplexity: null,
    geographicSourcingStrategy: null,
    leadTime: null,
  },
  kpis: {
    valueCreation: [],
    sustainability: [],
    resilience: [],
  },
  selectedCategories: [],
});

// Add these KPI-related properties to the BullseyeStore interface
interface BullseyeStore {
  // State
  activeSegment: string | null;
  visibleCategories: string[];
  isOuterVisible: boolean;
  initialAnimationComplete: boolean;
  containerAnimationProgress: number;
  selectedDimension: SelectedDimension | null;
  filterCategories: string[];
  visibleSegments: number;
  variants: string[];
  currentVariant: string;
  variantData: Record<string, VariantState>;
  badgeVisible: boolean;

  // Actions
  setActiveSegment: (segment: string | null) => void;
  toggleCategory: (category: string) => void;
  toggleOuterVisibility: () => void;
  setVisibleCategories: (categories: string[]) => void;
  setInitialAnimationComplete: (complete: boolean) => void;
  setContainerAnimationProgress: (progress: number) => void;
  updateAnimationProgress: (categories: string[]) => void;
  setSelectedDimension: (dimension: SelectedDimension | null) => void;
  setSelectedCategories: (categories: string[]) => void;
  toggleFilterCategory: (category: string) => void;
  setFilterCategories: (categories: string[]) => void;
  addToCart: (lever: DocLever) => void;
  removeFromCart: (leverId: string) => void;
  clearCart: () => void;
  isInCart: (leverId: string) => boolean;
  setVariants: (variants: string[]) => void;
  setCurrentVariant: (variant: string) => void;
  moveItemsBetweenVariants: (fromVariant: string, toVariant: string) => void;
  renameVariant: (oldName: string, newName: string) => void;
  setFilter: <K extends keyof FilterState>(
    filterType: K,
    value: FilterState[K]
  ) => void;
  resetFilters: () => void;
  calculateLeverWeight: (lever: DocLever) => number;
  setKPIs: <K extends keyof KPIState>(kpiType: K, values: string[]) => void;
  resetKPIs: () => void;
  isRecommendedLever: (leverId: string) => boolean;
  setBadgeVisible: (visible: boolean) => void;
  getLeversCountInDimension: (section: string, dimension: string) => number;

  // Helper getters for current variant data
  getCurrentVariantData: () => VariantState;
  getCurrentCartItems: () => DocLever[];
  getCurrentFilters: () => FilterState;
  getCurrentKPIs: () => KPIState;
  getCurrentSelectedCategories: () => string[];
  getAreExplanationsVisible: () => boolean;
}

export const useBullseyeStore = create<BullseyeStore>()(
  persist(
    (set, get) => {
      // Initialize with default variant
      const initialVariantData: Record<string, VariantState> = {
        "Variant 1": createDefaultVariantState(),
      };

      return {
        // Initial state
        activeSegment: null,
        visibleCategories: [],
        isOuterVisible: true,
        initialAnimationComplete: false,
        containerAnimationProgress: 0,
        selectedDimension: null,
        filterCategories: [],
        visibleSegments: 0,
        variants: ["Variant 1"],
        currentVariant: "Variant 1",
        variantData: initialVariantData,
        badgeVisible: true,

        // Helper getters for current variant data
        getCurrentVariantData: () => {
          const state = get();
          return (
            state.variantData[state.currentVariant] ||
            createDefaultVariantState()
          );
        },

        getCurrentCartItems: () => {
          return get().getCurrentVariantData().cartItems;
        },

        getCurrentFilters: () => {
          return get().getCurrentVariantData().filters;
        },

        getCurrentKPIs: () => {
          return get().getCurrentVariantData().kpis;
        },

        getCurrentSelectedCategories: () => {
          return get().getCurrentVariantData().selectedCategories;
        },

        getLeversCountInDimension: (section: string, dimension: string) => {
          const cartItems = get().getCurrentCartItems();
          return cartItems.filter(
            (lever) =>
              lever.section === section && lever.dimension === dimension
          ).length;
        },

        // Computed state
        getAreExplanationsVisible() {
          const state = get();
          const selectedCategories = state.getCurrentSelectedCategories();
          const allSections = [
            ...new Set(LEVER_DATA.map((lever) => lever.section)),
          ];
          const allSectionsVisible = allSections.every((section) =>
            state.visibleCategories.includes(section)
          );
          return state.initialAnimationComplete
            ? state.isOuterVisible &&
                (selectedCategories.length === 0 || allSectionsVisible)
            : true;
        },

        setBadgeVisible: (visible) => set({ badgeVisible: visible }),

        // Actions
        setActiveSegment: (segment) => set({ activeSegment: segment }),

        toggleCategory: (category) =>
          set((state) => {
            const currentVariant = state.currentVariant;
            const currentData = state.variantData[currentVariant];
            const selectedCategories = currentData.selectedCategories;

            const updatedCategories = selectedCategories.includes(category)
              ? selectedCategories.filter((cat) => cat !== category)
              : [...selectedCategories, category];

            return {
              selectedDimension: null,
              variantData: {
                ...state.variantData,
                [currentVariant]: {
                  ...currentData,
                  selectedCategories: updatedCategories,
                },
              },
            };
          }),

        toggleOuterVisibility: () =>
          set((state) => ({
            selectedDimension: null,
            isOuterVisible: !state.isOuterVisible,
          })),

        setVisibleCategories: (categories) =>
          set({ visibleCategories: categories }),

        setInitialAnimationComplete: (complete) =>
          set({ initialAnimationComplete: complete }),

        setContainerAnimationProgress: (progress) =>
          set({ containerAnimationProgress: progress }),

        updateAnimationProgress: (categories) =>
          set((state) => {
            if (
              JSON.stringify(state.visibleCategories) !==
              JSON.stringify(categories)
            ) {
              return { visibleCategories: categories };
            }
            return state;
          }),

        setSelectedDimension: (dimension) =>
          set({ selectedDimension: dimension }),

        setSelectedCategories: (categories) =>
          set((state) => {
            const currentVariant = state.currentVariant;
            const currentData = state.variantData[currentVariant];

            return {
              variantData: {
                ...state.variantData,
                [currentVariant]: {
                  ...currentData,
                  selectedCategories: categories,
                },
              },
            };
          }),

        toggleFilterCategory: (category) =>
          set((state) => ({
            filterCategories: state.filterCategories.includes(category)
              ? state.filterCategories.filter((cat) => cat !== category)
              : [...state.filterCategories, category],
          })),

        setFilterCategories: (categories) =>
          set({ filterCategories: categories }),

        addToCart: (lever) =>
          set((state) => {
            const currentVariant = state.currentVariant;
            const currentData = state.variantData[currentVariant];
            const cartItems = currentData.cartItems;

            // Check if item already exists in cart
            const itemExists = cartItems.some((item) => item.id === lever.id);
            const updatedCartItems = itemExists
              ? cartItems
              : [...cartItems, lever];

            return {
              variantData: {
                ...state.variantData,
                [currentVariant]: {
                  ...currentData,
                  cartItems: updatedCartItems,
                },
              },
            };
          }),

        removeFromCart: (leverId) =>
          set((state) => {
            const currentVariant = state.currentVariant;
            const currentData = state.variantData[currentVariant];

            return {
              variantData: {
                ...state.variantData,
                [currentVariant]: {
                  ...currentData,
                  cartItems: currentData.cartItems.filter(
                    (item) => item.id !== leverId
                  ),
                },
              },
            };
          }),

        clearCart: () =>
          set((state) => {
            const updatedVariantData = { ...state.variantData };

            // Clear cart for all variants
            state.variants.forEach((variant) => {
              if (updatedVariantData[variant]) {
                updatedVariantData[variant] = {
                  ...updatedVariantData[variant],
                  cartItems: [],
                };
              }
            });

            return { variantData: updatedVariantData };
          }),

        isInCart: (leverId) => {
          const cartItems = get().getCurrentCartItems();
          return cartItems.some((item) => item.id === leverId);
        },

        setVariants: (variants) =>
          set((state) => {
            const uniqueVariants = [...new Set([...variants])];
            const updatedVariantData = { ...state.variantData };

            // Add new variants with default state
            uniqueVariants.forEach((variant) => {
              if (!updatedVariantData[variant]) {
                updatedVariantData[variant] = createDefaultVariantState();
              }
            });

            // Remove variants that are no longer in the list
            Object.keys(updatedVariantData).forEach((variant) => {
              if (!uniqueVariants.includes(variant)) {
                delete updatedVariantData[variant];
              }
            });

            return {
              variants: uniqueVariants,
              variantData: updatedVariantData,
              // Update current variant if it was removed
              currentVariant: uniqueVariants.includes(state.currentVariant)
                ? state.currentVariant
                : uniqueVariants[0] || "Variant 1",
            };
          }),

        setCurrentVariant: (variant) => set({ currentVariant: variant }),

        moveItemsBetweenVariants: (fromVariant: string, toVariant: string) =>
          set((state) => {
            if (
              !state.variantData[fromVariant] ||
              !state.variantData[toVariant]
            )
              return state;

            // Get items from source variant
            const sourceItems = state.variantData[fromVariant].cartItems;
            const toVariantItems = state.variantData[toVariant].cartItems || [];

            // Merge items, removing duplicates
            const mergedItems = [
              ...toVariantItems,
              ...sourceItems.filter(
                (item) =>
                  !toVariantItems.some(
                    (existingItem) => existingItem.id === item.id
                  )
              ),
            ];

            const updatedVariantData = { ...state.variantData };
            updatedVariantData[toVariant] = {
              ...updatedVariantData[toVariant],
              cartItems: mergedItems,
            };
            updatedVariantData[fromVariant] = {
              ...updatedVariantData[fromVariant],
              cartItems: [], // Clear source variant
            };

            return { variantData: updatedVariantData };
          }),

        renameVariant: (oldName, newName) =>
          set((state) => {
            // Create a new copy of variantData
            const updatedVariantData = { ...state.variantData };
            const variant = updatedVariantData[oldName];

            // If the old variant doesn't exist, return unchanged state
            if (!variant) return state;

            // Remove old key and add new key
            delete updatedVariantData[oldName];
            updatedVariantData[newName] = variant;

            // Update the variants array
            const updatedVariants = state.variants.map(v => 
              v === oldName ? newName : v
            );

            return {
              variants: updatedVariants,
              variantData: updatedVariantData,
              currentVariant:
                state.currentVariant === oldName
                  ? newName
                  : state.currentVariant,
            };
          }),

        setFilter: (filterType, value) =>
          set((state) => {
            const currentVariant = state.currentVariant;
            const currentData = state.variantData[currentVariant];

            return {
              variantData: {
                ...state.variantData,
                [currentVariant]: {
                  ...currentData,
                  filters: {
                    ...currentData.filters,
                    [filterType]: value,
                  },
                },
              },
            };
          }),

        resetFilters: () =>
          set((state) => {
            const currentVariant = state.currentVariant;
            const currentData = state.variantData[currentVariant];

            return {
              variantData: {
                ...state.variantData,
                [currentVariant]: {
                  ...currentData,
                  filters: {
                    implementationTime: null,
                    materialDescription: null,
                    typeOfMaterial: null,
                    details: null,
                    esg: null,
                    numberOfSuppliers: null,
                    supplierPower: null,
                    commodityPriceTrend: null,
                    supplyChainComplexity: null,
                    geographicSourcingStrategy: null,
                    leadTime: null,
                  },
                },
              },
            };
          }),

        // Add KPI actions
        setKPIs: (kpiType, values) =>
          set((state) => {
            const currentVariant = state.currentVariant;
            const currentData = state.variantData[currentVariant];

            return {
              variantData: {
                ...state.variantData,
                [currentVariant]: {
                  ...currentData,
                  kpis: {
                    ...currentData.kpis,
                    [kpiType]: values,
                  },
                },
              },
            };
          }),

        resetKPIs: () =>
          set((state) => {
            const currentVariant = state.currentVariant;
            const currentData = state.variantData[currentVariant];

            return {
              variantData: {
                ...state.variantData,
                [currentVariant]: {
                  ...currentData,
                  kpis: {
                    valueCreation: [],
                    sustainability: [],
                    resilience: [],
                  },
                },
              },
            };
          }),

        // Modify calculateLeverWeight to use current variant data
        calculateLeverWeight: (lever) => {
          const state = get();
          let weight = 0;
          const filters = state.getCurrentFilters();
          const selectedCategories = state.getCurrentSelectedCategories();

          // Helper function to map filter values to indices
          const getIndex = (
            options: string[],
            value: string | null
          ): number => {
            if (!value) return -1;
            return options.indexOf(value);
          };

          // Helper function to check if a boolean filter matches and add weight
          const checkBooleanFilter = (
            filterValue: string | null,
            leverValues: boolean[] | undefined,
            options: string[]
          ): number => {
            if (!filterValue || !leverValues) return 0;

            const index = options.indexOf(filterValue);
            if (index >= 0 && leverValues[index]) {
              return 3; // Add 3 to weight for a match
            }
            return 0;
          };

          // Implementation Time
          weight += checkBooleanFilter(
            filters.implementationTime,
            lever.implementation_timeline,
            ["short term", "mid term", "long term"]
          );

          // Material Description
          weight += checkBooleanFilter(
            filters.materialDescription,
            lever.material_desc,
            ["Product", "Project", "System", "Service"]
          );

          // Type of Material
          weight += checkBooleanFilter(
            filters.typeOfMaterial,
            lever.material_type,
            ["Direct", "Indirect"]
          );

          // Details
          weight += checkBooleanFilter(filters.details, lever.details, [
            "Catalogue",
            "Standard",
            "Customized",
            "Raw Material",
          ]);

          // ESG
          weight += checkBooleanFilter(filters.esg, lever.esg, [
            "Environmental",
            "Social",
            "Governance",
          ]);

          // Number of Suppliers
          if (filters.numberOfSuppliers && lever.supplier_type) {
            const supplierOptions = ["Monopoly", "Oligopoly", "Polypoly"];
            const index = getIndex(supplierOptions, filters.numberOfSuppliers);
            if (index >= 0 && lever.supplier_type[index]) {
              weight += lever.supplier_type[index];
            }
          }

          // Supplier Power
          if (filters.supplierPower && lever.supplier_power) {
            const powerOptions = ["low", "medium", "high"];
            const index = getIndex(powerOptions, filters.supplierPower);
            if (index >= 0 && lever.supplier_power[index]) {
              weight += lever.supplier_power[index];
            }
          }

          // Category Price Trend
          if (filters.commodityPriceTrend && lever.price_trend) {
            const trendOptions = ["rising", "stable", "declining"];
            const index = getIndex(trendOptions, filters.commodityPriceTrend);
            if (index >= 0 && lever.price_trend[index]) {
              weight += lever.price_trend[index];
            }
          }

          // Supply Chain Complexity
          if (filters.supplyChainComplexity && lever.supply_chain) {
            const complexityOptions = [
              "High added value at Tier-1",
              "Moderate finishing depths in SC (Tier-1-3)",
              "Complex finishing depths in SC (Tier-N)",
            ];
            const index = getIndex(
              complexityOptions,
              filters.supplyChainComplexity
            );
            if (index >= 0 && lever.supply_chain[index]) {
              weight += lever.supply_chain[index];
            }
          }

          // Geographic Sourcing Strategy
          if (filters.geographicSourcingStrategy && lever.geo_sourcing) {
            const geoOptions = ["Local", "Regional", "Global"];
            const index = getIndex(
              geoOptions,
              filters.geographicSourcingStrategy
            );
            if (index >= 0 && lever.geo_sourcing[index]) {
              weight += lever.geo_sourcing[index];
            }
          }

          // Lead Time
          if (filters.leadTime && lever.lead_time) {
            const timeOptions = [
              "Low / < 6 Months",
              "Medium / < 1 year",
              "High / > 1 year",
            ];
            const index = getIndex(timeOptions, filters.leadTime);
            if (index >= 0 && lever.lead_time[index]) {
              weight += lever.lead_time[index];
            }
          }

          // Add weight for category matches
          if (selectedCategories.length > 0 && lever.categories) {
            // For each category match, add 3 to the weight
            selectedCategories.forEach((category) => {
              if (lever.categories?.includes(category)) {
                weight += 3;
              }
            });
          }

          return weight;
        },

        isRecommendedLever: (leverId: string) => {
          const state = get();
          const filters = state.getCurrentFilters();
          const kpis = state.getCurrentKPIs();

          // Check if any filters are set
          const hasSelectedFilters = Object.values(filters).some(
            (value) => value !== null
          );

          // If no filters are selected, return false
          if (!hasSelectedFilters) {
            return false;
          }

          // Get top 10 recommended levers across all dimensions
          const topLevers = getTopRecommendedLevers({
            levers: LEVER_DATA,
            calculateLeverWeight: state.calculateLeverWeight,
            selectedCategories: [],
            kpis: kpis,
            limit: 10,
          });

          // Check if the lever is in the top 10
          return topLevers.some((lever) => lever.id === leverId);
        },
      };
    },
    {
      name: "bullseye-storage", // unique name for localStorage key
      partialize: (state) => ({
        // only persist these fields
        variants: state.variants,
        currentVariant: state.currentVariant,
        variantData: state.variantData,
      }),
    }
  )
);
