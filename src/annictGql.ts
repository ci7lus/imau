/* eslint-disable */
import { GraphQLClient } from "graphql-request"
import { GraphQLClientRequestHeaders } from "graphql-request/build/cjs/types"
import gql from "graphql-tag"
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  DateTime: { input: any; output: any }
}

export type Activity = Node & {
  __typename?: "Activity"
  annictId: Scalars["Int"]["output"]
  id: Scalars["ID"]["output"]
  user: User
}

export enum ActivityAction {
  CREATE = "CREATE",
}

export type ActivityConnection = {
  __typename?: "ActivityConnection"
  edges: Maybe<Array<Maybe<ActivityEdge>>>
  nodes: Maybe<Array<Maybe<Activity>>>
  pageInfo: PageInfo
}

export type ActivityEdge = {
  __typename?: "ActivityEdge"
  action: ActivityAction
  annictId: Scalars["Int"]["output"]
  cursor: Scalars["String"]["output"]
  item: Maybe<ActivityItem>
  /** @deprecated Use `item` instead. */
  node: Maybe<ActivityItem>
  user: User
}

export type ActivityItem = MultipleRecord | WatchRecord | Review | Status

export type ActivityOrder = {
  direction: OrderDirection
  field: ActivityOrderField
}

export enum ActivityOrderField {
  CREATED_AT = "CREATED_AT",
}

export type Cast = Node & {
  __typename?: "Cast"
  annictId: Scalars["Int"]["output"]
  character: Character
  id: Scalars["ID"]["output"]
  name: Scalars["String"]["output"]
  nameEn: Scalars["String"]["output"]
  person: Person
  sortNumber: Scalars["Int"]["output"]
  work: Work
}

export type CastConnection = {
  __typename?: "CastConnection"
  edges: Maybe<Array<Maybe<CastEdge>>>
  nodes: Maybe<Array<Maybe<Cast>>>
  pageInfo: PageInfo
}

export type CastEdge = {
  __typename?: "CastEdge"
  cursor: Scalars["String"]["output"]
  node: Maybe<Cast>
}

export type CastOrder = {
  direction: OrderDirection
  field: CastOrderField
}

export enum CastOrderField {
  CREATED_AT = "CREATED_AT",
  SORT_NUMBER = "SORT_NUMBER",
}

export type Channel = Node & {
  __typename?: "Channel"
  annictId: Scalars["Int"]["output"]
  channelGroup: ChannelGroup
  id: Scalars["ID"]["output"]
  name: Scalars["String"]["output"]
  programs: Maybe<ProgramConnection>
  published: Scalars["Boolean"]["output"]
  scChid: Scalars["Int"]["output"]
}

export type ChannelprogramsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
}

export type ChannelConnection = {
  __typename?: "ChannelConnection"
  edges: Maybe<Array<Maybe<ChannelEdge>>>
  nodes: Maybe<Array<Maybe<Channel>>>
  pageInfo: PageInfo
}

export type ChannelEdge = {
  __typename?: "ChannelEdge"
  cursor: Scalars["String"]["output"]
  node: Maybe<Channel>
}

export type ChannelGroup = Node & {
  __typename?: "ChannelGroup"
  annictId: Scalars["Int"]["output"]
  channels: Maybe<ChannelConnection>
  id: Scalars["ID"]["output"]
  name: Scalars["String"]["output"]
  sortNumber: Scalars["Int"]["output"]
}

export type ChannelGroupchannelsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
}

export type Character = Node & {
  __typename?: "Character"
  age: Scalars["String"]["output"]
  ageEn: Scalars["String"]["output"]
  annictId: Scalars["Int"]["output"]
  birthday: Scalars["String"]["output"]
  birthdayEn: Scalars["String"]["output"]
  bloodType: Scalars["String"]["output"]
  bloodTypeEn: Scalars["String"]["output"]
  description: Scalars["String"]["output"]
  descriptionEn: Scalars["String"]["output"]
  descriptionSource: Scalars["String"]["output"]
  descriptionSourceEn: Scalars["String"]["output"]
  favoriteCharactersCount: Scalars["Int"]["output"]
  height: Scalars["String"]["output"]
  heightEn: Scalars["String"]["output"]
  id: Scalars["ID"]["output"]
  name: Scalars["String"]["output"]
  nameEn: Scalars["String"]["output"]
  nameKana: Scalars["String"]["output"]
  nationality: Scalars["String"]["output"]
  nationalityEn: Scalars["String"]["output"]
  nickname: Scalars["String"]["output"]
  nicknameEn: Scalars["String"]["output"]
  occupation: Scalars["String"]["output"]
  occupationEn: Scalars["String"]["output"]
  series: Series
  weight: Scalars["String"]["output"]
  weightEn: Scalars["String"]["output"]
}

export type CharacterConnection = {
  __typename?: "CharacterConnection"
  edges: Maybe<Array<Maybe<CharacterEdge>>>
  nodes: Maybe<Array<Maybe<Character>>>
  pageInfo: PageInfo
}

export type CharacterEdge = {
  __typename?: "CharacterEdge"
  cursor: Scalars["String"]["output"]
  node: Maybe<Character>
}

export type CharacterOrder = {
  direction: OrderDirection
  field: CharacterOrderField
}

export enum CharacterOrderField {
  CREATED_AT = "CREATED_AT",
  FAVORITE_CHARACTERS_COUNT = "FAVORITE_CHARACTERS_COUNT",
}

export type CreateRecordInput = {
  clientMutationId: InputMaybe<Scalars["String"]["input"]>
  comment: InputMaybe<Scalars["String"]["input"]>
  episodeId: Scalars["ID"]["input"]
  ratingState: InputMaybe<RatingState>
  shareFacebook: InputMaybe<Scalars["Boolean"]["input"]>
  shareTwitter: InputMaybe<Scalars["Boolean"]["input"]>
}

export type CreateRecordPayload = {
  __typename?: "CreateRecordPayload"
  clientMutationId: Maybe<Scalars["String"]["output"]>
  record: Maybe<WatchRecord>
}

export type CreateReviewInput = {
  body: Scalars["String"]["input"]
  clientMutationId: InputMaybe<Scalars["String"]["input"]>
  ratingAnimationState: InputMaybe<RatingState>
  ratingCharacterState: InputMaybe<RatingState>
  ratingMusicState: InputMaybe<RatingState>
  ratingOverallState: InputMaybe<RatingState>
  ratingStoryState: InputMaybe<RatingState>
  shareFacebook: InputMaybe<Scalars["Boolean"]["input"]>
  shareTwitter: InputMaybe<Scalars["Boolean"]["input"]>
  title: InputMaybe<Scalars["String"]["input"]>
  workId: Scalars["ID"]["input"]
}

export type CreateReviewPayload = {
  __typename?: "CreateReviewPayload"
  clientMutationId: Maybe<Scalars["String"]["output"]>
  review: Maybe<Review>
}

export type DeleteRecordInput = {
  clientMutationId: InputMaybe<Scalars["String"]["input"]>
  recordId: Scalars["ID"]["input"]
}

export type DeleteRecordPayload = {
  __typename?: "DeleteRecordPayload"
  clientMutationId: Maybe<Scalars["String"]["output"]>
  episode: Maybe<Episode>
}

export type DeleteReviewInput = {
  clientMutationId: InputMaybe<Scalars["String"]["input"]>
  reviewId: Scalars["ID"]["input"]
}

export type DeleteReviewPayload = {
  __typename?: "DeleteReviewPayload"
  clientMutationId: Maybe<Scalars["String"]["output"]>
  work: Maybe<Work>
}

export type Episode = Node & {
  __typename?: "Episode"
  annictId: Scalars["Int"]["output"]
  id: Scalars["ID"]["output"]
  nextEpisode: Maybe<Episode>
  number: Maybe<Scalars["Int"]["output"]>
  numberText: Maybe<Scalars["String"]["output"]>
  prevEpisode: Maybe<Episode>
  recordCommentsCount: Scalars["Int"]["output"]
  records: Maybe<RecordConnection>
  recordsCount: Scalars["Int"]["output"]
  satisfactionRate: Maybe<Scalars["Float"]["output"]>
  sortNumber: Scalars["Int"]["output"]
  title: Maybe<Scalars["String"]["output"]>
  viewerDidTrack: Scalars["Boolean"]["output"]
  viewerRecordsCount: Scalars["Int"]["output"]
  work: Work
}

export type EpisoderecordsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  hasComment: InputMaybe<Scalars["Boolean"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  orderBy: InputMaybe<RecordOrder>
}

export type EpisodeConnection = {
  __typename?: "EpisodeConnection"
  edges: Maybe<Array<Maybe<EpisodeEdge>>>
  nodes: Maybe<Array<Maybe<Episode>>>
  pageInfo: PageInfo
}

export type EpisodeEdge = {
  __typename?: "EpisodeEdge"
  cursor: Scalars["String"]["output"]
  node: Maybe<Episode>
}

export type EpisodeOrder = {
  direction: OrderDirection
  field: EpisodeOrderField
}

export enum EpisodeOrderField {
  CREATED_AT = "CREATED_AT",
  SORT_NUMBER = "SORT_NUMBER",
}

export type LibraryEntry = Node & {
  __typename?: "LibraryEntry"
  id: Scalars["ID"]["output"]
  nextEpisode: Maybe<Episode>
  nextProgram: Maybe<Program>
  note: Scalars["String"]["output"]
  status: Maybe<Status>
  user: User
  work: Work
}

export type LibraryEntryConnection = {
  __typename?: "LibraryEntryConnection"
  edges: Maybe<Array<Maybe<LibraryEntryEdge>>>
  nodes: Maybe<Array<Maybe<LibraryEntry>>>
  pageInfo: PageInfo
}

export type LibraryEntryEdge = {
  __typename?: "LibraryEntryEdge"
  cursor: Scalars["String"]["output"]
  node: Maybe<LibraryEntry>
}

export type LibraryEntryOrder = {
  direction: OrderDirection
  field: LibraryEntryOrderField
}

export enum LibraryEntryOrderField {
  LAST_TRACKED_AT = "LAST_TRACKED_AT",
}

export enum Media {
  MOVIE = "MOVIE",
  OTHER = "OTHER",
  OVA = "OVA",
  TV = "TV",
  WEB = "WEB",
}

export type MultipleRecord = Node & {
  __typename?: "MultipleRecord"
  annictId: Scalars["Int"]["output"]
  createdAt: Scalars["DateTime"]["output"]
  id: Scalars["ID"]["output"]
  records: Maybe<RecordConnection>
  user: User
  work: Work
}

export type MultipleRecordrecordsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
}

export type Mutation = {
  __typename?: "Mutation"
  createRecord: Maybe<CreateRecordPayload>
  createReview: Maybe<CreateReviewPayload>
  deleteRecord: Maybe<DeleteRecordPayload>
  deleteReview: Maybe<DeleteReviewPayload>
  updateRecord: Maybe<UpdateRecordPayload>
  updateReview: Maybe<UpdateReviewPayload>
  updateStatus: Maybe<UpdateStatusPayload>
}

export type MutationcreateRecordArgs = {
  input: CreateRecordInput
}

export type MutationcreateReviewArgs = {
  input: CreateReviewInput
}

export type MutationdeleteRecordArgs = {
  input: DeleteRecordInput
}

export type MutationdeleteReviewArgs = {
  input: DeleteReviewInput
}

export type MutationupdateRecordArgs = {
  input: UpdateRecordInput
}

export type MutationupdateReviewArgs = {
  input: UpdateReviewInput
}

export type MutationupdateStatusArgs = {
  input: UpdateStatusInput
}

export type Node = {
  id: Scalars["ID"]["output"]
}

export enum OrderDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export type Organization = Node & {
  __typename?: "Organization"
  annictId: Scalars["Int"]["output"]
  favoriteOrganizationsCount: Scalars["Int"]["output"]
  id: Scalars["ID"]["output"]
  name: Scalars["String"]["output"]
  nameEn: Scalars["String"]["output"]
  nameKana: Scalars["String"]["output"]
  staffsCount: Scalars["Int"]["output"]
  twitterUsername: Scalars["String"]["output"]
  twitterUsernameEn: Scalars["String"]["output"]
  url: Scalars["String"]["output"]
  urlEn: Scalars["String"]["output"]
  wikipediaUrl: Scalars["String"]["output"]
  wikipediaUrlEn: Scalars["String"]["output"]
}

export type OrganizationConnection = {
  __typename?: "OrganizationConnection"
  edges: Maybe<Array<Maybe<OrganizationEdge>>>
  nodes: Maybe<Array<Maybe<Organization>>>
  pageInfo: PageInfo
}

export type OrganizationEdge = {
  __typename?: "OrganizationEdge"
  cursor: Scalars["String"]["output"]
  node: Maybe<Organization>
}

export type OrganizationOrder = {
  direction: OrderDirection
  field: OrganizationOrderField
}

export enum OrganizationOrderField {
  CREATED_AT = "CREATED_AT",
  FAVORITE_ORGANIZATIONS_COUNT = "FAVORITE_ORGANIZATIONS_COUNT",
}

export type PageInfo = {
  __typename?: "PageInfo"
  endCursor: Maybe<Scalars["String"]["output"]>
  hasNextPage: Scalars["Boolean"]["output"]
  hasPreviousPage: Scalars["Boolean"]["output"]
  startCursor: Maybe<Scalars["String"]["output"]>
}

export type Person = Node & {
  __typename?: "Person"
  annictId: Scalars["Int"]["output"]
  birthday: Scalars["String"]["output"]
  bloodType: Scalars["String"]["output"]
  castsCount: Scalars["Int"]["output"]
  favoritePeopleCount: Scalars["Int"]["output"]
  genderText: Scalars["String"]["output"]
  height: Scalars["String"]["output"]
  id: Scalars["ID"]["output"]
  name: Scalars["String"]["output"]
  nameEn: Scalars["String"]["output"]
  nameKana: Scalars["String"]["output"]
  nickname: Scalars["String"]["output"]
  nicknameEn: Scalars["String"]["output"]
  prefecture: Prefecture
  staffsCount: Scalars["Int"]["output"]
  twitterUsername: Scalars["String"]["output"]
  twitterUsernameEn: Scalars["String"]["output"]
  url: Scalars["String"]["output"]
  urlEn: Scalars["String"]["output"]
  wikipediaUrl: Scalars["String"]["output"]
  wikipediaUrlEn: Scalars["String"]["output"]
}

export type PersonConnection = {
  __typename?: "PersonConnection"
  edges: Maybe<Array<Maybe<PersonEdge>>>
  nodes: Maybe<Array<Maybe<Person>>>
  pageInfo: PageInfo
}

export type PersonEdge = {
  __typename?: "PersonEdge"
  cursor: Scalars["String"]["output"]
  node: Maybe<Person>
}

export type PersonOrder = {
  direction: OrderDirection
  field: PersonOrderField
}

export enum PersonOrderField {
  CREATED_AT = "CREATED_AT",
  FAVORITE_PEOPLE_COUNT = "FAVORITE_PEOPLE_COUNT",
}

export type Prefecture = Node & {
  __typename?: "Prefecture"
  annictId: Scalars["Int"]["output"]
  id: Scalars["ID"]["output"]
  name: Scalars["String"]["output"]
}

export type Program = Node & {
  __typename?: "Program"
  annictId: Scalars["Int"]["output"]
  channel: Channel
  episode: Episode
  id: Scalars["ID"]["output"]
  rebroadcast: Scalars["Boolean"]["output"]
  scPid: Maybe<Scalars["Int"]["output"]>
  startedAt: Scalars["DateTime"]["output"]
  state: ProgramState
  work: Work
}

export type ProgramConnection = {
  __typename?: "ProgramConnection"
  edges: Maybe<Array<Maybe<ProgramEdge>>>
  nodes: Maybe<Array<Maybe<Program>>>
  pageInfo: PageInfo
}

export type ProgramEdge = {
  __typename?: "ProgramEdge"
  cursor: Scalars["String"]["output"]
  node: Maybe<Program>
}

export type ProgramOrder = {
  direction: OrderDirection
  field: ProgramOrderField
}

export enum ProgramOrderField {
  STARTED_AT = "STARTED_AT",
}

export enum ProgramState {
  HIDDEN = "HIDDEN",
  PUBLISHED = "PUBLISHED",
}

export type Query = {
  __typename?: "Query"
  node: Maybe<Node>
  nodes: Array<Maybe<Node>>
  searchCharacters: Maybe<CharacterConnection>
  searchEpisodes: Maybe<EpisodeConnection>
  searchOrganizations: Maybe<OrganizationConnection>
  searchPeople: Maybe<PersonConnection>
  searchWorks: Maybe<WorkConnection>
  user: Maybe<User>
  viewer: Maybe<User>
}

export type QuerynodeArgs = {
  id: Scalars["ID"]["input"]
}

export type QuerynodesArgs = {
  ids: Array<Scalars["ID"]["input"]>
}

export type QuerysearchCharactersArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  annictIds: InputMaybe<Array<Scalars["Int"]["input"]>>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  names: InputMaybe<Array<Scalars["String"]["input"]>>
  orderBy: InputMaybe<CharacterOrder>
}

export type QuerysearchEpisodesArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  annictIds: InputMaybe<Array<Scalars["Int"]["input"]>>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  orderBy: InputMaybe<EpisodeOrder>
}

export type QuerysearchOrganizationsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  annictIds: InputMaybe<Array<Scalars["Int"]["input"]>>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  names: InputMaybe<Array<Scalars["String"]["input"]>>
  orderBy: InputMaybe<OrganizationOrder>
}

export type QuerysearchPeopleArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  annictIds: InputMaybe<Array<Scalars["Int"]["input"]>>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  names: InputMaybe<Array<Scalars["String"]["input"]>>
  orderBy: InputMaybe<PersonOrder>
}

export type QuerysearchWorksArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  annictIds: InputMaybe<Array<Scalars["Int"]["input"]>>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  orderBy: InputMaybe<WorkOrder>
  seasons: InputMaybe<Array<Scalars["String"]["input"]>>
  titles: InputMaybe<Array<Scalars["String"]["input"]>>
}

export type QueryuserArgs = {
  username: Scalars["String"]["input"]
}

export enum RatingState {
  AVERAGE = "AVERAGE",
  BAD = "BAD",
  GOOD = "GOOD",
  GREAT = "GREAT",
}

export type WatchRecord = Node & {
  __typename?: "Record"
  annictId: Scalars["Int"]["output"]
  comment: Maybe<Scalars["String"]["output"]>
  commentsCount: Scalars["Int"]["output"]
  createdAt: Scalars["DateTime"]["output"]
  episode: Episode
  facebookClickCount: Scalars["Int"]["output"]
  id: Scalars["ID"]["output"]
  likesCount: Scalars["Int"]["output"]
  modified: Scalars["Boolean"]["output"]
  rating: Maybe<Scalars["Float"]["output"]>
  ratingState: Maybe<RatingState>
  twitterClickCount: Scalars["Int"]["output"]
  updatedAt: Scalars["DateTime"]["output"]
  user: User
  work: Work
}

export type RecordConnection = {
  __typename?: "RecordConnection"
  edges: Maybe<Array<Maybe<RecordEdge>>>
  nodes: Maybe<Array<Maybe<WatchRecord>>>
  pageInfo: PageInfo
}

export type RecordEdge = {
  __typename?: "RecordEdge"
  cursor: Scalars["String"]["output"]
  node: Maybe<WatchRecord>
}

export type RecordOrder = {
  direction: OrderDirection
  field: RecordOrderField
}

export enum RecordOrderField {
  CREATED_AT = "CREATED_AT",
  LIKES_COUNT = "LIKES_COUNT",
}

export type Review = Node & {
  __typename?: "Review"
  annictId: Scalars["Int"]["output"]
  body: Scalars["String"]["output"]
  createdAt: Scalars["DateTime"]["output"]
  id: Scalars["ID"]["output"]
  impressionsCount: Scalars["Int"]["output"]
  likesCount: Scalars["Int"]["output"]
  modifiedAt: Maybe<Scalars["DateTime"]["output"]>
  ratingAnimationState: Maybe<RatingState>
  ratingCharacterState: Maybe<RatingState>
  ratingMusicState: Maybe<RatingState>
  ratingOverallState: Maybe<RatingState>
  ratingStoryState: Maybe<RatingState>
  title: Maybe<Scalars["String"]["output"]>
  updatedAt: Scalars["DateTime"]["output"]
  user: User
  work: Work
}

export type ReviewConnection = {
  __typename?: "ReviewConnection"
  edges: Maybe<Array<Maybe<ReviewEdge>>>
  nodes: Maybe<Array<Maybe<Review>>>
  pageInfo: PageInfo
}

export type ReviewEdge = {
  __typename?: "ReviewEdge"
  cursor: Scalars["String"]["output"]
  node: Maybe<Review>
}

export type ReviewOrder = {
  direction: OrderDirection
  field: ReviewOrderField
}

export enum ReviewOrderField {
  CREATED_AT = "CREATED_AT",
  LIKES_COUNT = "LIKES_COUNT",
}

export enum SeasonName {
  AUTUMN = "AUTUMN",
  SPRING = "SPRING",
  SUMMER = "SUMMER",
  WINTER = "WINTER",
}

export type Series = Node & {
  __typename?: "Series"
  annictId: Scalars["Int"]["output"]
  id: Scalars["ID"]["output"]
  name: Scalars["String"]["output"]
  nameEn: Scalars["String"]["output"]
  nameRo: Scalars["String"]["output"]
  works: Maybe<SeriesWorkConnection>
}

export type SeriesworksArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  orderBy: InputMaybe<SeriesWorkOrder>
}

export type SeriesConnection = {
  __typename?: "SeriesConnection"
  edges: Maybe<Array<Maybe<SeriesEdge>>>
  nodes: Maybe<Array<Maybe<Series>>>
  pageInfo: PageInfo
}

export type SeriesEdge = {
  __typename?: "SeriesEdge"
  cursor: Scalars["String"]["output"]
  node: Maybe<Series>
}

export type SeriesWorkConnection = {
  __typename?: "SeriesWorkConnection"
  edges: Maybe<Array<Maybe<SeriesWorkEdge>>>
  nodes: Maybe<Array<Maybe<Work>>>
  pageInfo: PageInfo
}

export type SeriesWorkEdge = {
  __typename?: "SeriesWorkEdge"
  cursor: Scalars["String"]["output"]
  item: Work
  /** @deprecated Use `item` instead. */
  node: Work
  summary: Maybe<Scalars["String"]["output"]>
  summaryEn: Maybe<Scalars["String"]["output"]>
}

export type SeriesWorkOrder = {
  direction: OrderDirection
  field: SeriesWorkOrderField
}

export enum SeriesWorkOrderField {
  SEASON = "SEASON",
}

export type Staff = Node & {
  __typename?: "Staff"
  annictId: Scalars["Int"]["output"]
  id: Scalars["ID"]["output"]
  name: Scalars["String"]["output"]
  nameEn: Scalars["String"]["output"]
  resource: StaffResourceItem
  roleOther: Scalars["String"]["output"]
  roleOtherEn: Scalars["String"]["output"]
  roleText: Scalars["String"]["output"]
  sortNumber: Scalars["Int"]["output"]
  work: Work
}

export type StaffConnection = {
  __typename?: "StaffConnection"
  edges: Maybe<Array<Maybe<StaffEdge>>>
  nodes: Maybe<Array<Maybe<Staff>>>
  pageInfo: PageInfo
}

export type StaffEdge = {
  __typename?: "StaffEdge"
  cursor: Scalars["String"]["output"]
  node: Maybe<Staff>
}

export type StaffOrder = {
  direction: OrderDirection
  field: StaffOrderField
}

export enum StaffOrderField {
  CREATED_AT = "CREATED_AT",
  SORT_NUMBER = "SORT_NUMBER",
}

export type StaffResourceItem = Organization | Person

export type Status = Node & {
  __typename?: "Status"
  annictId: Scalars["Int"]["output"]
  createdAt: Scalars["DateTime"]["output"]
  id: Scalars["ID"]["output"]
  likesCount: Scalars["Int"]["output"]
  state: StatusState
  user: User
  work: Work
}

export enum StatusState {
  NO_STATE = "NO_STATE",
  ON_HOLD = "ON_HOLD",
  STOP_WATCHING = "STOP_WATCHING",
  WANNA_WATCH = "WANNA_WATCH",
  WATCHED = "WATCHED",
  WATCHING = "WATCHING",
}

export type UpdateRecordInput = {
  clientMutationId: InputMaybe<Scalars["String"]["input"]>
  comment: InputMaybe<Scalars["String"]["input"]>
  ratingState: InputMaybe<RatingState>
  recordId: Scalars["ID"]["input"]
  shareFacebook: InputMaybe<Scalars["Boolean"]["input"]>
  shareTwitter: InputMaybe<Scalars["Boolean"]["input"]>
}

export type UpdateRecordPayload = {
  __typename?: "UpdateRecordPayload"
  clientMutationId: Maybe<Scalars["String"]["output"]>
  record: Maybe<WatchRecord>
}

export type UpdateReviewInput = {
  body: Scalars["String"]["input"]
  clientMutationId: InputMaybe<Scalars["String"]["input"]>
  ratingAnimationState: RatingState
  ratingCharacterState: RatingState
  ratingMusicState: RatingState
  ratingOverallState: RatingState
  ratingStoryState: RatingState
  reviewId: Scalars["ID"]["input"]
  shareFacebook: InputMaybe<Scalars["Boolean"]["input"]>
  shareTwitter: InputMaybe<Scalars["Boolean"]["input"]>
  title: InputMaybe<Scalars["String"]["input"]>
}

export type UpdateReviewPayload = {
  __typename?: "UpdateReviewPayload"
  clientMutationId: Maybe<Scalars["String"]["output"]>
  review: Maybe<Review>
}

export type UpdateStatusInput = {
  clientMutationId: InputMaybe<Scalars["String"]["input"]>
  state: StatusState
  workId: Scalars["ID"]["input"]
}

export type UpdateStatusPayload = {
  __typename?: "UpdateStatusPayload"
  clientMutationId: Maybe<Scalars["String"]["output"]>
  work: Maybe<Work>
}

export type User = Node & {
  __typename?: "User"
  activities: Maybe<ActivityConnection>
  annictId: Scalars["Int"]["output"]
  avatarUrl: Maybe<Scalars["String"]["output"]>
  backgroundImageUrl: Maybe<Scalars["String"]["output"]>
  createdAt: Scalars["DateTime"]["output"]
  description: Scalars["String"]["output"]
  email: Maybe<Scalars["String"]["output"]>
  followers: Maybe<UserConnection>
  followersCount: Scalars["Int"]["output"]
  following: Maybe<UserConnection>
  followingActivities: Maybe<ActivityConnection>
  followingsCount: Scalars["Int"]["output"]
  id: Scalars["ID"]["output"]
  libraryEntries: Maybe<LibraryEntryConnection>
  name: Scalars["String"]["output"]
  notificationsCount: Maybe<Scalars["Int"]["output"]>
  onHoldCount: Scalars["Int"]["output"]
  programs: Maybe<ProgramConnection>
  records: Maybe<RecordConnection>
  recordsCount: Scalars["Int"]["output"]
  stopWatchingCount: Scalars["Int"]["output"]
  url: Maybe<Scalars["String"]["output"]>
  username: Scalars["String"]["output"]
  viewerCanFollow: Scalars["Boolean"]["output"]
  viewerIsFollowing: Scalars["Boolean"]["output"]
  wannaWatchCount: Scalars["Int"]["output"]
  watchedCount: Scalars["Int"]["output"]
  watchingCount: Scalars["Int"]["output"]
  works: Maybe<WorkConnection>
}

export type UseractivitiesArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  orderBy: InputMaybe<ActivityOrder>
}

export type UserfollowersArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
}

export type UserfollowingArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
}

export type UserfollowingActivitiesArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  orderBy: InputMaybe<ActivityOrder>
}

export type UserlibraryEntriesArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  orderBy: InputMaybe<LibraryEntryOrder>
  seasonFrom: InputMaybe<Scalars["String"]["input"]>
  seasonUntil: InputMaybe<Scalars["String"]["input"]>
  seasons: InputMaybe<Array<Scalars["String"]["input"]>>
  states: InputMaybe<Array<StatusState>>
}

export type UserprogramsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  orderBy: InputMaybe<ProgramOrder>
  unwatched: InputMaybe<Scalars["Boolean"]["input"]>
}

export type UserrecordsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  hasComment: InputMaybe<Scalars["Boolean"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  orderBy: InputMaybe<RecordOrder>
}

export type UserworksArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  annictIds: InputMaybe<Array<Scalars["Int"]["input"]>>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  orderBy: InputMaybe<WorkOrder>
  seasons: InputMaybe<Array<Scalars["String"]["input"]>>
  state: InputMaybe<StatusState>
  titles: InputMaybe<Array<Scalars["String"]["input"]>>
}

export type UserConnection = {
  __typename?: "UserConnection"
  edges: Maybe<Array<Maybe<UserEdge>>>
  nodes: Maybe<Array<Maybe<User>>>
  pageInfo: PageInfo
}

export type UserEdge = {
  __typename?: "UserEdge"
  cursor: Scalars["String"]["output"]
  node: Maybe<User>
}

export type Work = Node & {
  __typename?: "Work"
  annictId: Scalars["Int"]["output"]
  casts: Maybe<CastConnection>
  episodes: Maybe<EpisodeConnection>
  episodesCount: Scalars["Int"]["output"]
  id: Scalars["ID"]["output"]
  image: Maybe<WorkImage>
  malAnimeId: Maybe<Scalars["String"]["output"]>
  media: Media
  noEpisodes: Scalars["Boolean"]["output"]
  officialSiteUrl: Maybe<Scalars["String"]["output"]>
  officialSiteUrlEn: Maybe<Scalars["String"]["output"]>
  programs: Maybe<ProgramConnection>
  reviews: Maybe<ReviewConnection>
  reviewsCount: Scalars["Int"]["output"]
  satisfactionRate: Maybe<Scalars["Float"]["output"]>
  seasonName: Maybe<SeasonName>
  seasonYear: Maybe<Scalars["Int"]["output"]>
  seriesList: Maybe<SeriesConnection>
  staffs: Maybe<StaffConnection>
  syobocalTid: Maybe<Scalars["Int"]["output"]>
  title: Scalars["String"]["output"]
  titleEn: Maybe<Scalars["String"]["output"]>
  titleKana: Maybe<Scalars["String"]["output"]>
  titleRo: Maybe<Scalars["String"]["output"]>
  twitterHashtag: Maybe<Scalars["String"]["output"]>
  twitterUsername: Maybe<Scalars["String"]["output"]>
  viewerStatusState: Maybe<StatusState>
  watchersCount: Scalars["Int"]["output"]
  wikipediaUrl: Maybe<Scalars["String"]["output"]>
  wikipediaUrlEn: Maybe<Scalars["String"]["output"]>
}

export type WorkcastsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  orderBy: InputMaybe<CastOrder>
}

export type WorkepisodesArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  orderBy: InputMaybe<EpisodeOrder>
}

export type WorkprogramsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  orderBy: InputMaybe<ProgramOrder>
}

export type WorkreviewsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  hasBody: InputMaybe<Scalars["Boolean"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  orderBy: InputMaybe<ReviewOrder>
}

export type WorkseriesListArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
}

export type WorkstaffsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>
  before: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  orderBy: InputMaybe<StaffOrder>
}

export type WorkConnection = {
  __typename?: "WorkConnection"
  edges: Maybe<Array<Maybe<WorkEdge>>>
  nodes: Maybe<Array<Maybe<Work>>>
  pageInfo: PageInfo
}

export type WorkEdge = {
  __typename?: "WorkEdge"
  cursor: Scalars["String"]["output"]
  node: Maybe<Work>
}

export type WorkImage = Node & {
  __typename?: "WorkImage"
  annictId: Maybe<Scalars["Int"]["output"]>
  copyright: Maybe<Scalars["String"]["output"]>
  facebookOgImageUrl: Maybe<Scalars["String"]["output"]>
  id: Scalars["ID"]["output"]
  internalUrl: Maybe<Scalars["String"]["output"]>
  recommendedImageUrl: Maybe<Scalars["String"]["output"]>
  twitterAvatarUrl: Maybe<Scalars["String"]["output"]>
  twitterBiggerAvatarUrl: Maybe<Scalars["String"]["output"]>
  twitterMiniAvatarUrl: Maybe<Scalars["String"]["output"]>
  twitterNormalAvatarUrl: Maybe<Scalars["String"]["output"]>
  work: Maybe<Work>
}

export type WorkImageinternalUrlArgs = {
  size: Scalars["String"]["input"]
}

export type WorkOrder = {
  direction: OrderDirection
  field: WorkOrderField
}

export enum WorkOrderField {
  CREATED_AT = "CREATED_AT",
  SEASON = "SEASON",
  WATCHERS_COUNT = "WATCHERS_COUNT",
}

export type queryLibraryQueryVariables = Exact<{
  states: InputMaybe<Array<StatusState> | StatusState>
  after: InputMaybe<Scalars["String"]["input"]>
  amount: InputMaybe<Scalars["Int"]["input"]>
}>

export type queryLibraryQuery = {
  __typename?: "Query"
  viewer: {
    __typename?: "User"
    libraryEntries: {
      __typename?: "LibraryEntryConnection"
      nodes: Array<{
        __typename?: "LibraryEntry"
        work: {
          __typename?: "Work"
          id: string
          annictId: number
          malAnimeId: string | null
          titleEn: string | null
          titleRo: string | null
          title: string
          noEpisodes: boolean
          viewerStatusState: StatusState | null
          episodes: {
            __typename?: "EpisodeConnection"
            nodes: Array<{
              __typename?: "Episode"
              viewerDidTrack: boolean
            } | null> | null
          } | null
        }
      } | null> | null
      pageInfo: {
        __typename?: "PageInfo"
        hasNextPage: boolean
        hasPreviousPage: boolean
        endCursor: string | null
      }
    } | null
  } | null
}

export type queryWorksQueryVariables = Exact<{
  workIds: InputMaybe<Array<Scalars["Int"]["input"]> | Scalars["Int"]["input"]>
}>

export type queryWorksQuery = {
  __typename?: "Query"
  searchWorks: {
    __typename?: "WorkConnection"
    nodes: Array<{
      __typename?: "Work"
      id: string
      annictId: number
      malAnimeId: string | null
      titleEn: string | null
      titleRo: string | null
      title: string
      noEpisodes: boolean
      viewerStatusState: StatusState | null
      episodes: {
        __typename?: "EpisodeConnection"
        nodes: Array<{
          __typename?: "Episode"
          viewerDidTrack: boolean
        } | null> | null
      } | null
    } | null> | null
  } | null
}

export type getMeQueryVariables = Exact<{ [key: string]: never }>

export type getMeQuery = {
  __typename?: "Query"
  viewer: {
    __typename?: "User"
    username: string
    name: string
    avatarUrl: string | null
  } | null
}

export const queryLibraryDocument = gql`
  query queryLibrary($states: [StatusState!], $after: String, $amount: Int) {
    viewer {
      libraryEntries(states: $states, after: $after, first: $amount) {
        nodes {
          work {
            id
            annictId
            malAnimeId
            titleEn
            titleRo
            title
            noEpisodes
            episodes {
              nodes {
                viewerDidTrack
              }
            }
            viewerStatusState
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
        }
      }
    }
  }
`
export const queryWorksDocument = gql`
  query queryWorks($workIds: [Int!]) {
    searchWorks(annictIds: $workIds) {
      nodes {
        id
        annictId
        malAnimeId
        titleEn
        titleRo
        title
        noEpisodes
        episodes {
          nodes {
            viewerDidTrack
          }
        }
        viewerStatusState
      }
    }
  }
`
export const getMeDocument = gql`
  query getMe {
    viewer {
      username
      name
      avatarUrl
    }
  }
`

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string
) => Promise<T>

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType
) => action()

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  return {
    queryLibrary(
      variables?: queryLibraryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<queryLibraryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<queryLibraryQuery>(queryLibraryDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "queryLibrary",
        "query"
      )
    },
    queryWorks(
      variables?: queryWorksQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<queryWorksQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<queryWorksQuery>(queryWorksDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "queryWorks",
        "query"
      )
    },
    getMe(
      variables?: getMeQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<getMeQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<getMeQuery>(getMeDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "getMe",
        "query"
      )
    },
  }
}
export type Sdk = ReturnType<typeof getSdk>
