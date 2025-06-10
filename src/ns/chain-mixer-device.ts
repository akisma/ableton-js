import { Ableton } from "../index";
import { DeviceParameter } from "./device-parameter";

export interface RawChainMixerDevice {
  id: number;
  canonical_parent: { id: number; };
  chain_activator: { id: number; value: number; };
  panning: { id: number; value: number; };
  sends: Array<{ id: number; value: number; }>;
  volume: { id: number; value: number; };
}

/**
 * Represents a Chain's Mixer Device in Ableton Live.
 * This class gives you access to the Volume, Panning, and Send properties of a Chain.
 * Based on Live API 11.0.0 specification.
 */
export class ChainMixerDevice {
  /**
   * Reference to the main Ableton instance
   */
  protected ableton: Ableton;

  /**
   * Raw chain mixer device data from Live
   */
  protected raw: RawChainMixerDevice;

  /**
   * The API path to this chain mixer device
   */
  protected path: string;

  /**
   * Creates a new ChainMixerDevice instance.
   * 
   * @param ableton - The Ableton instance
   * @param raw - Raw chain mixer device data from Live
   * @param path - The path to this chain mixer device in the Live API
   */
  constructor(
    ableton: Ableton,
    raw: RawChainMixerDevice,
    path: string = "",
  ) {
    this.ableton = ableton;
    this.raw = raw;
    this.path = path;
  }

  /**
   * Gets the chain mixer device's unique identifier.
   * 
   * @returns The chain mixer device ID
   */
  get id(): number {
    return this.raw.id;
  }

  /**
   * Gets the canonical parent of the mixer device.
   * 
   * @returns Promise resolving to the canonical parent object
   */
  async getCanonicalParent(): Promise<any> {
    return this.ableton.getProp(this.path, undefined, "canonical_parent");
  }

  /**
   * Gets the Chain's Activator Device Parameter.
   * The chain activator controls whether the chain is active or deactivated.
   * 
   * @returns Promise resolving to a DeviceParameter instance for the chain activator
   */
  async getChainActivator(): Promise<DeviceParameter> {
    const activatorData = await this.ableton.getProp(this.path, undefined, "chain_activator");
    return new DeviceParameter(this.ableton, activatorData);
  }

  /**
   * Gets the Chain's Panning Device Parameter.
   * 
   * @returns Promise resolving to a DeviceParameter instance for panning control
   */
  async getPanning(): Promise<DeviceParameter> {
    const panningData = await this.ableton.getProp(this.path, undefined, "panning");
    return new DeviceParameter(this.ableton, panningData);
  }

  /**
   * Gets all Send Device Parameters for this chain mixer device.
   * 
   * @returns Promise resolving to an array of DeviceParameter instances for send controls
   */
  async getSends(): Promise<DeviceParameter[]> {
    const sendsData = await this.ableton.getProp(this.path, undefined, "sends");
    return sendsData.map((sendData: any, index: number) => 
      new DeviceParameter(this.ableton, sendData)
    );
  }

  /**
   * Gets the Chain's Volume Device Parameter.
   * 
   * @returns Promise resolving to a DeviceParameter instance for volume control
   */
  async getVolume(): Promise<DeviceParameter> {
    const volumeData = await this.ableton.getProp(this.path, undefined, "volume");
    return new DeviceParameter(this.ableton, volumeData);
  }

  /**
   * Gets a specific send Device Parameter by index.
   * 
   * @param index - The index of the send (0-based)
   * @returns Promise resolving to a DeviceParameter instance or null if not found
   */
  async getSend(index: number): Promise<DeviceParameter | null> {
    try {
      const sendData = await this.ableton.getProp(this.path, undefined, `sends ${index}`);
      return new DeviceParameter(this.ableton, sendData);
    } catch (error) {
      return null;
    }
  }

  /**
   * Adds a listener for canonical parent changes.
   * 
   * @param listener - Callback function to be called when canonical parent changes
   */
  addCanonicalParentListener(listener: () => void): void {
    this.ableton.addListener("canonical_parent", listener);
  }

  /**
   * Removes a canonical parent listener.
   * 
   * @param listener - The listener function to remove
   */
  removeCanonicalParentListener(listener: () => void): void {
    this.ableton.removeListener("canonical_parent", listener);
  }

  /**
   * Adds a listener for chain activator parameter changes.
   * 
   * @param listener - Callback function to be called when chain activator changes
   */
  addChainActivatorListener(listener: () => void): void {
    this.ableton.addListener("chain_activator", listener);
  }

  /**
   * Removes a chain activator listener.
   * 
   * @param listener - The listener function to remove
   */
  removeChainActivatorListener(listener: () => void): void {
    this.ableton.removeListener("chain_activator", listener);
  }

  /**
   * Adds a listener for panning parameter changes.
   * 
   * @param listener - Callback function to be called when panning changes
   */
  addPanningListener(listener: () => void): void {
    this.ableton.addListener("panning", listener);
  }

  /**
   * Removes a panning listener.
   * 
   * @param listener - The listener function to remove
   */
  removePanningListener(listener: () => void): void {
    this.ableton.removeListener("panning", listener);
  }

  /**
   * Adds a listener for sends parameter array changes.
   * 
   * @param listener - Callback function to be called when sends array changes
   */
  addSendsListener(listener: () => void): void {
    this.ableton.addListener("sends", listener);
  }

  /**
   * Removes a sends listener.
   * 
   * @param listener - The listener function to remove
   */
  removeSendsListener(listener: () => void): void {
    this.ableton.removeListener("sends", listener);
  }

  /**
   * Adds a listener for volume parameter changes.
   * 
   * @param listener - Callback function to be called when volume changes
   */
  addVolumeListener(listener: () => void): void {
    this.ableton.addListener("volume", listener);
  }

  /**
   * Removes a volume listener.
   * 
   * @param listener - The listener function to remove
   */
  removeVolumeListener(listener: () => void): void {
    this.ableton.removeListener("volume", listener);
  }

  //TODO: Implement these methods after figuring out how to check for listeners in dgram/etc

  
  // /**
  //  * Checks if canonical parent has a listener.
  //  * 
  //  * @param listener - The listener function to check
  //  * @returns Promise resolving to true if the listener is connected
  //  */
  // async canonicalParentHasListener(listener: () => void): Promise<boolean> {
  //   return this.ableton.hasListener("canonical_parent", listener);
  // }

  // /**
  //  * Checks if chain activator has a listener.
  //  * 
  //  * @param listener - The listener function to check
  //  * @returns Promise resolving to true if the listener is connected
  //  */
  // async chainActivatorHasListener(listener: () => void): Promise<boolean> {
  //   return this.ableton.hasListener("chain_activator", listener);
  // }

  // /**
  //  * Checks if panning has a listener.
  //  * 
  //  * @param listener - The listener function to check
  //  * @returns Promise resolving to true if the listener is connected
  //  */
  // async panningHasListener(listener: () => void): Promise<boolean> {
  //   return this.ableton.hasListener("panning", listener);
  // }

  // /**
  //  * Checks if sends has a listener.
  //  * 
  //  * @param listener - The listener function to check
  //  * @returns Promise resolving to true if the listener is connected
  //  */
  // async sendsHasListener(listener: () => void): Promise<boolean> {
  //   return this.ableton.hasListener("sends", listener);
  // }

  // /**
  //  * Checks if volume has a listener.
  //  * 
  //  * @param listener - The listener function to check
  //  * @returns Promise resolving to true if the listener is connected
  //  */
  // async volumeHasListener(listener: () => void): Promise<boolean> {
  //   return this.ableton.hasListener("volume", listener);
  // }

  /**
   * Converts the chain mixer device data to a JSON representation.
   * 
   * @returns Object containing the chain mixer device's properties
   */
  toJSON(): Record<string, unknown> {
    return {
      id: this.raw.id,
      canonical_parent: this.raw.canonical_parent,
      chain_activator: this.raw.chain_activator,
      panning: this.raw.panning,
      sends: this.raw.sends,
      volume: this.raw.volume,
    };
  }
}