// Mock Supabase client for demo purposes - no real Supabase connection needed
const mockData = {
  requests: [
    {
      id: 'REQ001',
      title: 'New Laptops for Development Team',
      status: 'APPROVED',
      grn_status: 'PENDING',
      created_at: '2025-02-23T17:35:41Z',
      created_by: 'current-user-id',
      total_cost: 5000,
      current_approval_step: 3,
      total_approval_steps: 3,
      approver_role: 'IT_MANAGER',
      workflow_status: 'Approved by all approvers',
      creator: {
        name: 'John Doe',
        department: 'Engineering'
      }
    },
    {
      id: 'REQ002',
      title: 'Office Furniture - Standing Desks',
      status: 'PENDING',
      grn_status: 'PENDING',
      created_at: '2025-02-22T10:15:00Z',
      created_by: 'current-user-id',
      total_cost: 2000,
      current_approval_step: 1,
      total_approval_steps: 3,
      approver_role: 'PROCUREMENT',
      workflow_status: 'Pending procurement approval',
      creator: {
        name: 'John Doe',
        department: 'Engineering'
      }
    },
    {
      id: 'REQ003',
      title: 'Conference Room AV Equipment',
      status: 'IN_REVIEW',
      grn_status: 'PENDING',
      created_at: '2025-02-21T14:20:00Z',
      created_by: 'other-user-id',
      total_cost: 10000,
      current_approval_step: 2,
      total_approval_steps: 3,
      approver_role: 'FINANCE',
      workflow_status: 'Pending finance approval',
      creator: {
        name: 'Jane Smith',
        department: 'Operations'
      }
    },
    {
      id: 'REQ004',
      title: 'Marketing Team iPads',
      status: 'DRAFT',
      grn_status: 'PENDING',
      created_at: '2025-02-20T09:45:00Z',
      created_by: 'current-user-id',
      total_cost: 3000,
      current_approval_step: 0,
      total_approval_steps: 3,
      approver_role: null,
      workflow_status: 'Draft',
      creator: {
        name: 'John Doe',
        department: 'Engineering'
      }
    }
  ]
};

const mockClient = {
  auth: {
    signOut: async () => ({ error: null }),
    getSession: () => null,
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getUser: async () => ({ data: { user: { id: '1', email: 'test@example.com' } }, error: null })
  },
  channel: (name: string) => ({
    on: (event: string, schema: string, table: string, callback: Function) => ({
      subscribe: () => ({
        unsubscribe: () => {}
      })
    })
  }),
  removeChannel: (channel: any) => {},
  from: (table: string) => ({
    select: (columns: string = '*') => {
      const query = {
        eq: (column: string, value: any) => ({
          eq: (col: string, val: any) => ({
            ilike: (col: string, val: any) => ({
              limit: (num: number) => ({
                data: mockData[table]?.filter(item => 
                  item[column] === value && 
                  item[col] === val &&
                  item.title?.toLowerCase().includes(val.replace(/%/g, '').toLowerCase())
                ) || [],
                error: null
              }),
              data: mockData[table]?.filter(item => 
                item[column] === value && 
                item[col] === val
              ) || [],
              error: null,
              single: () => ({ 
                data: mockData[table]?.find(item => 
                  item[column] === value && 
                  item[col] === val
                ) || null,
                error: null 
              }),
              maybeSingle: () => ({ 
                data: mockData[table]?.find(item => 
                  item[column] === value && 
                  item[col] === val
                ) || null,
                error: null 
              })
            }),
            limit: (num: number) => ({
              data: mockData[table]?.filter(item => 
                item[column] === value && 
                item[col] === val
              ) || [],
              error: null
            }),
            data: mockData[table]?.filter(item => 
              item[column] === value && 
              item[col] === val
            ) || [],
            error: null,
            single: () => ({ 
              data: mockData[table]?.find(item => 
                item[column] === value && 
                item[col] === val
              ) || null,
              error: null 
            }),
            maybeSingle: () => ({ 
              data: mockData[table]?.find(item => 
                item[column] === value && 
                item[col] === val
              ) || null,
              error: null 
            })
          }),
          ilike: (col: string, val: any) => ({
            data: mockData[table]?.filter(item => 
              item[column] === value && 
              item.title?.toLowerCase().includes(val.replace(/%/g, '').toLowerCase())
            ) || [],
            error: null
          }),
          data: mockData[table]?.filter(item => item[column] === value) || [],
          error: null,
          single: () => ({ 
            data: mockData[table]?.find(item => item[column] === value) || null,
            error: null 
          }),
          maybeSingle: () => ({ 
            data: mockData[table]?.find(item => item[column] === value) || null,
            error: null 
          }),
          order: (col: string, { ascending }: { ascending: boolean }) => ({
            data: mockData[table]?.filter(item => item[column] === value)
              .sort((a, b) => ascending ? 
                (a[col] > b[col] ? 1 : -1) : 
                (a[col] < b[col] ? 1 : -1)
              ) || [],
            error: null
          })
        }),
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          eq: (col: string, val: any) => ({
            data: mockData[table]?.filter(item => item[col] === val)
              .sort((a, b) => ascending ? 
                (a[column] > b[column] ? 1 : -1) : 
                (a[column] < b[column] ? 1 : -1)
              ) || [],
            error: null,
            single: () => ({ 
              data: mockData[table]?.find(item => item[col] === val) || null,
              error: null 
            }),
            maybeSingle: () => ({ 
              data: mockData[table]?.find(item => item[col] === val) || null,
              error: null 
            })
          }),
          data: mockData[table]?.sort((a, b) => ascending ? 
            (a[column] > b[column] ? 1 : -1) : 
            (a[column] < b[column] ? 1 : -1)
          ) || [],
          error: null
        }),
        single: () => ({ data: mockData[table]?.[0] || null, error: null }),
        maybeSingle: () => ({ data: mockData[table]?.[0] || null, error: null }),
        data: mockData[table] || [],
        error: null
      };
      return query;
    },
    insert: (data: any) => ({
      select: () => ({
        single: () => ({ data: { id: 'NEW_ID', ...data }, error: null }),
        maybeSingle: () => ({ data: { id: 'NEW_ID', ...data }, error: null }),
        data: { id: 'NEW_ID', ...data },
        error: null
      }),
      single: () => ({ data: { id: 'NEW_ID', ...data }, error: null }),
      maybeSingle: () => ({ data: { id: 'NEW_ID', ...data }, error: null }),
      data: { id: 'NEW_ID', ...data },
      error: null
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: () => ({ data: { id: value, ...data }, error: null }),
          maybeSingle: () => ({ data: { id: value, ...data }, error: null }),
          data: { id: value, ...data },
          error: null
        }),
        data: { id: value, ...data },
        error: null,
        single: () => ({ data: { id: value, ...data }, error: null }),
        maybeSingle: () => ({ data: { id: value, ...data }, error: null })
      })
    })
  }),
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => ({ data: { path }, error: null }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: `https://example.com/${path}` }, error: null })
    })
  }
};

export const supabase = mockClient;
