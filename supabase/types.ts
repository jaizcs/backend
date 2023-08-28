export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					operationName?: string;
					query?: string;
					variables?: Json;
					extensions?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			Messages: {
				Row: {
					createdAt: string;
					id: number;
					message: string;
					role: Database['public']['Enums']['MessageRole'];
					TicketId: number;
					updatedAt: string;
					UserId: string | null;
				};
				Insert: {
					createdAt?: string;
					id?: number;
					message: string;
					role: Database['public']['Enums']['MessageRole'];
					TicketId: number;
					updatedAt?: string;
					UserId?: string | null;
				};
				Update: {
					createdAt?: string;
					id?: number;
					message?: string;
					role?: Database['public']['Enums']['MessageRole'];
					TicketId?: number;
					updatedAt?: string;
					UserId?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'Messages_TicketId_fkey';
						columns: ['TicketId'];
						referencedRelation: 'Tickets';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Messages_UserId_fkey';
						columns: ['UserId'];
						referencedRelation: 'Users';
						referencedColumns: ['id'];
					},
				];
			};
			Tickets: {
				Row: {
					createdAt: string;
					description: string;
					embedding: string;
					id: number;
					isSatisfactory: boolean;
					resolution: string | null;
					status: Database['public']['Enums']['TicketStatus'];
					type: string;
					updatedAt: string;
					UserId: string | null;
				};
				Insert: {
					createdAt?: string;
					description: string;
					embedding: string;
					id?: number;
					isSatisfactory?: boolean;
					resolution?: string | null;
					status?: Database['public']['Enums']['TicketStatus'];
					type: string;
					updatedAt?: string;
					UserId?: string | null;
				};
				Update: {
					createdAt?: string;
					description?: string;
					embedding?: string;
					id?: number;
					isSatisfactory?: boolean;
					resolution?: string | null;
					status?: Database['public']['Enums']['TicketStatus'];
					type?: string;
					updatedAt?: string;
					UserId?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'Tickets_UserId_fkey';
						columns: ['UserId'];
						referencedRelation: 'Users';
						referencedColumns: ['id'];
					},
				];
			};
			Users: {
				Row: {
					createdAt: string;
					email: string;
					id: string;
					name: string;
					password: string;
					role: Database['public']['Enums']['UserRole'];
					updatedAt: string;
				};
				Insert: {
					createdAt?: string;
					email: string;
					id?: string;
					name: string;
					password: string;
					role?: Database['public']['Enums']['UserRole'];
					updatedAt?: string;
				};
				Update: {
					createdAt?: string;
					email?: string;
					id?: string;
					name?: string;
					password?: string;
					role?: Database['public']['Enums']['UserRole'];
					updatedAt?: string;
				};
				Relationships: [];
			};
			WidgetTokens: {
				Row: {
					createdAt: string;
					id: string;
					name: string;
					token: string;
					updatedAt: string;
					UserId: string;
				};
				Insert: {
					createdAt?: string;
					id?: string;
					name: string;
					token: string;
					updatedAt?: string;
					UserId: string;
				};
				Update: {
					createdAt?: string;
					id?: string;
					name?: string;
					token?: string;
					updatedAt?: string;
					UserId?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'WidgetTokens_UserId_fkey';
						columns: ['UserId'];
						referencedRelation: 'Users';
						referencedColumns: ['id'];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			MessageRole: 'system' | 'ai' | 'assistant' | 'customer';
			TicketStatus: 'in progress' | 'resolved' | 'unresolved';
			UserRole: 'admin' | 'staff';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	storage: {
		Tables: {
			buckets: {
				Row: {
					allowed_mime_types: string[] | null;
					avif_autodetection: boolean | null;
					created_at: string | null;
					file_size_limit: number | null;
					id: string;
					name: string;
					owner: string | null;
					public: boolean | null;
					updated_at: string | null;
				};
				Insert: {
					allowed_mime_types?: string[] | null;
					avif_autodetection?: boolean | null;
					created_at?: string | null;
					file_size_limit?: number | null;
					id: string;
					name: string;
					owner?: string | null;
					public?: boolean | null;
					updated_at?: string | null;
				};
				Update: {
					allowed_mime_types?: string[] | null;
					avif_autodetection?: boolean | null;
					created_at?: string | null;
					file_size_limit?: number | null;
					id?: string;
					name?: string;
					owner?: string | null;
					public?: boolean | null;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'buckets_owner_fkey';
						columns: ['owner'];
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
				];
			};
			migrations: {
				Row: {
					executed_at: string | null;
					hash: string;
					id: number;
					name: string;
				};
				Insert: {
					executed_at?: string | null;
					hash: string;
					id: number;
					name: string;
				};
				Update: {
					executed_at?: string | null;
					hash?: string;
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			objects: {
				Row: {
					bucket_id: string | null;
					created_at: string | null;
					id: string;
					last_accessed_at: string | null;
					metadata: Json | null;
					name: string | null;
					owner: string | null;
					path_tokens: string[] | null;
					updated_at: string | null;
					version: string | null;
				};
				Insert: {
					bucket_id?: string | null;
					created_at?: string | null;
					id?: string;
					last_accessed_at?: string | null;
					metadata?: Json | null;
					name?: string | null;
					owner?: string | null;
					path_tokens?: string[] | null;
					updated_at?: string | null;
					version?: string | null;
				};
				Update: {
					bucket_id?: string | null;
					created_at?: string | null;
					id?: string;
					last_accessed_at?: string | null;
					metadata?: Json | null;
					name?: string | null;
					owner?: string | null;
					path_tokens?: string[] | null;
					updated_at?: string | null;
					version?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'objects_bucketId_fkey';
						columns: ['bucket_id'];
						referencedRelation: 'buckets';
						referencedColumns: ['id'];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			can_insert_object: {
				Args: {
					bucketid: string;
					name: string;
					owner: string;
					metadata: Json;
				};
				Returns: undefined;
			};
			extension: {
				Args: {
					name: string;
				};
				Returns: string;
			};
			filename: {
				Args: {
					name: string;
				};
				Returns: string;
			};
			foldername: {
				Args: {
					name: string;
				};
				Returns: unknown;
			};
			get_size_by_bucket: {
				Args: Record<PropertyKey, never>;
				Returns: {
					size: number;
					bucket_id: string;
				}[];
			};
			search: {
				Args: {
					prefix: string;
					bucketname: string;
					limits?: number;
					levels?: number;
					offsets?: number;
					search?: string;
					sortcolumn?: string;
					sortorder?: string;
				};
				Returns: {
					name: string;
					id: string;
					updated_at: string;
					created_at: string;
					last_accessed_at: string;
					metadata: Json;
				}[];
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
