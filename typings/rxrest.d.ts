/// <reference path="../interfaces.d.ts" />

import { Stream } from 'most';
export function fetch(input: string | RequestWithHeaders, init?: RequestOptions, abortCallback?: (req: Request) => void): Stream<any>;

export interface RxRestInterface<T> {
  json?(): string;
  one?<T>(route: string, id?: any): RxRestItemInterface<T>;
  all?<T>(route: string): RxRestCollectionInterface<T>;
  fromObject?<T>(route: string, element: T|T[]): RxRestItemInterface<T>|RxRestCollectionInterface<T>;
  post?(body?: BodyParam<T>, queryParams?: Object|URLSearchParams, headers?: Object|Headers): PromisableStream<RxRestItemInterface<T>|RxRestCollectionInterface<T>>;
  put?(body?: BodyParam<T>, queryParams?: Object|URLSearchParams, headers?: Object|Headers): PromisableStream<RxRestItemInterface<T>|RxRestCollectionInterface<T>>;
  patch?(body?: BodyParam<T>, queryParams?: Object|URLSearchParams, headers?: Object|Headers): PromisableStream<RxRestItemInterface<T>|RxRestCollectionInterface<T>>;
  remove?(queryParams?: Object|URLSearchParams, headers?: Object|Headers): PromisableStream<RxRestItemInterface<T>|RxRestCollectionInterface<T>>;
  get?(queryParams?: Object|URLSearchParams, headers?: Object|Headers): PromisableStream<RxRestItemInterface<T>|RxRestCollectionInterface<T>>;
  head?(queryParams?: Object|URLSearchParams, headers?: Object|Headers): PromisableStream<RxRestItemInterface<T>|RxRestCollectionInterface<T>>;
  trace?(queryParams?: Object|URLSearchParams, headers?: Object|Headers): PromisableStream<RxRestItemInterface<T>|RxRestCollectionInterface<T>>;
  options?(queryParams?: Object|URLSearchParams, headers?: Object|Headers): PromisableStream<RxRestItemInterface<T>|RxRestCollectionInterface<T>>;
  URL?: string;
  baseURL?: string;
  identifier?: string;
  setQueryParams?(params: any): RxRestInterface<T>;
  localQueryParams?: any;
  setHeaders?(params: any): RxRestInterface<T>;
  localHeaders?: any;
  headers?: any;
  queryParams?: any;
  readonly requestQueryParams?: any;
  readonly requestHeaders?: any;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
  errorInterceptors?: ErrorInterceptor[];
  fetch?: any
  requestBodyHandler?: RequestBodyHandler<T>;
  responseBodyHandler?: ResponseBodyHandler;
  request?(method: string, body?: BodyParam<T>): PromisableStream<RxRestItemInterface<T> & T>;
}

export interface RxRestItemInterface<T> extends RxRestInterface<T> {
  $element?: T;
  save?<T>(queryParams?: Object|URLSearchParams, headers?: Object|Headers): PromisableStream<RxRestItemInterface<T>|RxRestCollectionInterface<T>>;
  clone?<T>(): RxRestItemInterface<T>;
  plain?(): T;
}

export interface RxRestCollectionInterface<T> extends RxRestInterface<T>, Iterable<RxRestItemInterface<T>> {
  $elements?: RxRestItemInterface<T>[];
  getList?<T>(queryParams?: Object|URLSearchParams, headers?: Object|Headers): PromisableStream<RxRestItemInterface<T>|RxRestCollectionInterface<T>>;
  clone?<T>(): RxRestCollectionInterface<T>;
  plain?(): T[];
}

export interface RequestInterceptor {
  (request: Request): Stream<Request>|Promise<Request>|undefined|Request|void;
}

export interface ResponseInterceptor {
  (body: Body): Stream<Body|Object|undefined>|Promise<Body|Object|undefined>|undefined|Body|void;
}

export interface ErrorInterceptor {
  (response: Response): Stream<Response>|void|Response|Promise<Response>;
}

export type BodyParam<T> = RxRestItemInterface<T>|FormData|URLSearchParams|Body|Blob|undefined|Object;

export interface RequestBodyHandler<T> {
  (body: BodyParam<T>): FormData|URLSearchParams|Body|Blob|undefined|string|Promise<any>
}

export interface ResponseBodyHandler {
  (body: Response): Promise<any>
}

export interface PromisableStream<T> extends Stream<T> {
  then: (resolve: (value?: any) => void) => void
}

export interface ErrorResponse extends Response {
  name: string;
  message: string;
}

export interface RequestOptions {
  method: string;
  headers?: Headers;
  body?: Body|Blob|FormData|URLSearchParams|Object;
  mode?: string;
  credentials?: string;
  cache?: string;
  redirect?: string;
  referrer?: string;
  integrity?: string;
}

export interface FixedHeaders extends Map<string, string> {
  append: (name: string, value: string) => void;
  getAll: () => Object[];
}

export interface RequestWithHeaders extends Request {
  headers: FixedHeaders;
}

/**
  * RxRestConfiguration
  */
export class RxRestConfiguration {
    baseURL: string;
    identifier: string;
    requestInterceptors: RequestInterceptor[];
    responseInterceptors: ResponseInterceptor[];
    errorInterceptors: ErrorInterceptor[];
    headers: Headers;
    queryParams: URLSearchParams;
    fetch: any;
    abortCallback: (req: Request) => void;
    /**
      * requestBodyHandler
      * JSONify the body if it's an `RxRestItem` or an `Object`
      *
      * @param {FormData|URLSearchParams|Body|Blob|undefined} body
      * @returns {any}
      */
    requestBodyHandler(body: FormData | URLSearchParams | Body | Blob | undefined): FormData | URLSearchParams | Body | Blob | undefined | string | Promise<any>;
    /**
      * responseBodyHandler
      * transforms the response to a json object
      *
      * @param {Response} body
      * @reject when response is an error
      * @returns {Promise<any>}
      */
    responseBodyHandler(body: Response): Promise<any>;
}

export class RxRest<T> implements RxRestInterface<T> {
    protected $route: string[];
    $fromServer: boolean;
    $queryParams: URLSearchParams;
    $headers: Headers;
    /**
      * constructor
      *
      * @param {String} [route] the resource route
      */
    constructor(route?: string[]);
    protected addRoute(route: string): void;
    /**
      * one
      *
      * @param {String} route
      * @param {any} id
      * @returns {RxRestItem}
      */
    one<T>(route: string, id?: any): RxRestItemInterface<T>;
    /**
      * all
      *
      * @param {String} route
      * @returns {RxRestCollection}
      */
    all<T>(route: string): RxRestCollectionInterface<T>;
    /**
      * fromObject
      *
      * @param {String} route
      * @param {Object|Object[]} element
      * @returns {RxRestItem|RxRestCollection}
      */
    fromObject<T>(route: string, element: T | T[]): RxRestItemInterface<T> | RxRestCollectionInterface<T>;
    /**
      * @access private
      * @param {BodyParam} body
      * @return {BodyParam|RxRestItem}
      */
    protected withBody(body: BodyParam<T>): BodyParam<T>;
    /**
      * post
      *
      * @param {Body|Blob|FormData|URLSearchParams|Object|RxRestItem} [body]
      * @param {Object|URLSearchParams} [queryParams]
      * @param {Object|Headers} [headers]
      * @returns {Stream<RxRestItem|RxRestCollection>}
      */
    post(body?: BodyParam<T>, queryParams?: Object | URLSearchParams, headers?: Object | Headers): PromisableStream<RxRestItemInterface<T> | RxRestCollectionInterface<T>>;
    /**
      * remove
      *
      * @param {Object|URLSearchParams} [queryParams]
      * @param {Object|Headers} [headers]
      * @returns {Stream<RxRestItem|RxRestCollection>}
      */
    remove(queryParams?: Object | URLSearchParams, headers?: Object | Headers): PromisableStream<RxRestItemInterface<T> | RxRestCollectionInterface<T>>;
    /**
      * get
      *
      * @param {Object|URLSearchParams} [queryParams]
      * @param {Object|Headers} [headers]
      * @returns {Stream<RxRestItem|RxRestCollection>}
      */
    get(queryParams?: Object | URLSearchParams, headers?: Object | Headers): PromisableStream<RxRestItemInterface<T> | RxRestCollectionInterface<T>>;
    /**
      * put
      *
      * @param {Body|Blob|FormData|URLSearchParams|Object|RxRestItem} [body]
      * @param {Object|URLSearchParams} [queryParams]
      * @param {Object|Headers} [headers]
      * @returns {Stream<RxRestItem|RxRestCollection>}
      */
    put(body?: BodyParam<T>, queryParams?: Object | URLSearchParams, headers?: Object | Headers): PromisableStream<RxRestItemInterface<T> | RxRestCollectionInterface<T>>;
    /**
      * patch
      *
      * @param {Body|Blob|FormData|URLSearchParams|Object|RxRestItem} [body]
      * @param {Object|URLSearchParams} [queryParams]
      * @param {Object|Headers} [headers]
      * @returns {Stream<RxRestItem|RxRestCollection>}
      */
    patch(body?: BodyParam<T>, queryParams?: Object | URLSearchParams, headers?: Object | Headers): PromisableStream<RxRestItemInterface<T> | RxRestCollectionInterface<T>>;
    /**
      * head
      *
      * @param {Object|URLSearchParams} [queryParams]
      * @param {Object|Headers} [headers]
      * @returns {Stream<RxRestItem|RxRestCollection>}
      */
    head(queryParams?: Object | URLSearchParams, headers?: Object | Headers): PromisableStream<RxRestItemInterface<T> | RxRestCollectionInterface<T>>;
    /**
      * trace
      *
      * @param {Object|URLSearchParams} [queryParams]
      * @param {Object|Headers} [headers]
      * @returns {Stream<RxRestItem|RxRestCollection>}
      */
    trace(queryParams?: Object | URLSearchParams, headers?: Object | Headers): PromisableStream<RxRestItemInterface<T> | RxRestCollectionInterface<T>>;
    /**
      * options
      *
      * @param {Object|URLSearchParams} [queryParams]
      * @param {Object|Headers} [headers]
      * @returns {Stream<RxRestItem|RxRestCollection>}
      */
    options(queryParams?: Object | URLSearchParams, headers?: Object | Headers): PromisableStream<RxRestItemInterface<T> | RxRestCollectionInterface<T>>;
    /**
      * URL
      *
      * @returns {string}
      */
    readonly URL: string;
    /**
      * get baseURL
      *
      * @returns {string}
      */
    /**
      * set baseURL
      *
      * @param {String} base
      * @returns
      */
    baseURL: string;
    /**
      * Get identifier key
      */
    /**
      * Set identifier key
      *
      * @param {String} id
      */
    identifier: string;
    /**
      * Get local query params
      * @return URLSearchParams
      */
    /**
      * set local query params
      * @param {Object|URLSearchParams} params
      */
    localQueryParams: any;
    /**
      * Sets local query params useful to add params to a custom request
      * @param {Object|URLSearchParams}
      * @return this
      */
    setQueryParams(params: any): RxRest<T>;
    /**
      * Sets local headers useful to add headers to a custom request
      * @param {Object|URLSearchParams}
      * @return this
      */
    setHeaders(params: any): RxRest<T>;
    /**
      * Get global query params
      * @return {URLSearchParams}
      */
    /**
      * Set global query params
      * @param {Object|URLSearchParams} params
      */
    queryParams: any;
    /**
      * Get request query params
      * Combine local and global query params
      * Local query params are overriding global params
      * @return {String}
      */
    readonly requestQueryParams: string;
    /**
      * Get local headers
      * @return Headers
      */
    /**
      * Set local headers
      * @param {Object|Headers} params
      */
    localHeaders: any;
    /**
      * Get global headers
      * @return Headers
      */
    /**
      * set global headers
      * @param {Object|Headers} params
      */
    headers: any;
    /**
      * get request Headers
      * Combine local and global headers
      * Local headers are overriding global headers
      *
      * @returns {Headers}
      */
    readonly requestHeaders: Headers;
    /**
      * get requestInterceptors
      *
      * @returns {RequestInterceptor[]}
      */
    /**
      * set requestInterceptors
      *
      * @param {RequestInterceptor[]} requestInterceptors
      */
    requestInterceptors: RequestInterceptor[];
    /**
      * get responseInterceptors
      *
      * @returns {ResponseInterceptor[]}
      */
    /**
      * set responseInterceptors
      *
      * @param {ResponseInterceptor[]} responseInterceptor
      */
    responseInterceptors: ResponseInterceptor[];
    /**
      * get errorInterceptors
      *
      * @returns {ErrorInterceptor[]}
      */
    /**
      * set errorInterceptors
      *
      * @param {ErrorInterceptor[]} errorInterceptors
      */
    errorInterceptors: ErrorInterceptor[];
    /**
      * requestBodyHandler
      *
      * @returns {Function}
      */
    /**
      * set requestBodyHandler
      *
      * @param {Function} fn
      */
    requestBodyHandler: RequestBodyHandler<T>;
    /**
      * get responseBodyHandler
      *
      * @returns {ResponseBodyHandler}
      */
    /**
      * set responseBodyHandler
      * @param {ResponseBodyHandler} fn
      */
    responseBodyHandler: ResponseBodyHandler;
    /**
      * @return fn the current cancel callback
      */
    /**
      * @param fn the callback that will be called on request abortion
      */
    abortCallback: (req: Request) => void;
    fetch: any;
    /**
      * expandInterceptors
      *
      * @param {RequestInterceptor[]|ResponseInterceptor[]|ErrorInterceptor[]} interceptors
      * @returns {Stream<any>} fn
      */
    private expandInterceptors(interceptors);
    /**
      * request
      *
      * @param {string} method
      * @param {RxRestItem|FormData|URLSearchParams|Body|Blob|undefined|Object} [body]
      * @returns {Stream<RxRestItem|RxRestCollection>}
      */
    request(method: string, body?: BodyParam<T>): PromisableStream<RxRestItemInterface<T> & T>;
}
export class RxRestProxyHandler<T> implements ProxyHandler<RxRest<T>> {
    private $internal;
    private $instance;
    constructor(target: RxRestItem<T> | RxRestCollection<T>);
    getPrototypeOf(target: any): any;
    defineProperty(target: any, p: PropertyKey, attributes: PropertyDescriptor): boolean;
    deleteProperty(target: any, p: PropertyKey): boolean;
    set(target: any, p: PropertyKey, value: any, receiver: any): boolean;
    get(target: any, p: PropertyKey, receiver: any): any;
}
export class RxRestItem<T> extends RxRest<T> implements RxRestItemInterface<T> {
    $element: T;
    /**
      * constructor
      *
      * @param {string[]} route
      * @param {T} [element]
      * @return {Proxy}
      */
    constructor(route: string[], element?: T);
    /**
      * save - POST or PUT according to $fromServer value
      *
      * @param {Object|URLSearchParams} [queryParams]
      * @param {Object|Headers} [headers]
      * @returns {Stream<RxRestItem|RxRestCollection>}
      */
    save(queryParams?: Object | URLSearchParams, headers?: Object | Headers): PromisableStream<RxRestItemInterface<T> | RxRestCollectionInterface<T>>;
    /**
      * get element
      *
      * @return {T}
      */
    /**
      * set element
      *
      * @param {T} element
      */
    element: T;
    /**
      * get plain object
      *
      * @return {T}
      */
    plain(): T;
    /**
      * Get json string
      * @return {string}
      */
    json(): string;
    /**
      * Clone
      * @return {RxRestItem<T>}
      */
    clone(): RxRestItemInterface<T>;
}
export class RxRestCollection<T> extends RxRest<T> implements Iterable<RxRestItemInterface<T>>, RxRestCollectionInterface<T> {
    length: number;
    $elements: RxRestItemInterface<T>[];
    [index: number]: RxRestItemInterface<T>;
    /**
      * constructor
      *
      * @param {string[]} route
      * @param {T[]|RxRestItem<T>[]]} [elements]
      * @return {Proxy}
      */
    constructor(route: string[], elements?: T[] | RxRestItemInterface<T>[]);
    [Symbol.iterator](): {
        next(): IteratorResult<RxRestItemInterface<T>>;
    };
    /**
      * getList - fetch a collection
      *
      * @param {Object|URLSearchParams} [queryParams]
      * @param {Object|Headers} [headers]
      * @returns {Stream<RxRestItem|RxRestCollection>}
      */
    getList(queryParams?: Object | URLSearchParams, headers?: Object | Headers): PromisableStream<RxRestItemInterface<T> | RxRestCollectionInterface<T>>;
    /**
      * get elements
      * @return {RxRestItem<T>[]}
      */
    /**
      * set elements
      *
      * @param {T[]} elements
      */
    elements: RxRestItemInterface<T>[];
    /**
      * plain
      *
      * @returns {T[]}
      */
    plain(): T[];
    /**
      * json
      *
      * @returns {String}
      */
    json(): string;
    /**
      * clone
      *
      * @returns {RxRestCollection}
      */
    clone(): RxRestCollectionInterface<T>;
}
export class NewRxRest {
    one<T>(route: string, id?: any): RxRestItemInterface<T>;
    all<T>(route: string): RxRestCollectionInterface<T>;
    fromObject<T>(route: string, element: T | T[]): RxRestItemInterface<T> | RxRestCollectionInterface<T>;
}
