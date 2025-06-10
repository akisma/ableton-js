import { Ableton } from "../index";
import { Device } from "./device";
import { ChainMixerDevice } from "./chain-mixer-device";

export interface GettableProperties {
  id: number;
  name: string;
  color: number;
  color_index: number;
  is_auto_colored: boolean;
  mute: boolean;
  solo: boolean;
  devices: Array<{ id: number; type: string; }>;
  mixer_device: { id: number; };
}

export interface TransformableProperties {
  name: string;
  color: number;
  color_index: number;
  is_auto_colored: boolean;
  mute: boolean;
  solo: boolean;
}

export interface RawChain {
  id: number;
  name: string;
  color: number;
  color_index: number;
  is_auto_colored: boolean;
  mute: boolean;
  solo: boolean;
  devices: Array<{ id: number; type: string; }>;
  mixer_device: { id: number; };
  //TODO not sure if we should do this?
  
//   devices: Array<{
//     id: number;
//     type: string;
//     class_name: string;
//     class_display_name: string;
//     can_have_chains: boolean;
//     can_have_drum_pads: boolean;
//     parameters: Array<{
//       id: number;
//       name: string;
//       value: number;
//       min: number;
//       max: number;
//       is_enabled: boolean;
//       is_quantized: boolean;
//       value_items: string[];
//     }>;
//   }>;
//   mixer_device: {
//     id: number;
//     canonical_parent: { id: number; };
//     chain_activator: { id: number; value: number; };
//     panning: { id: number; value: number; };
//     sends: Array<{ id: number; value: number; }>;
//     volume: { id: number; value: number; };
//   };
}

/**
 * Represents a chain in Ableton Live.
 * A Chain is a container for devices that can be found in Racks (Instrument, Drum, Audio Effect Racks).
 * Chains have their own mixer device with volume, panning, and send controls.
 */
export class Chain <
  GettableProperties,
  TransformedProperties,
//   SettableProperties,
//   ObservableProperties
>{
  /**
   * Reference to the main Ableton instance
   */
  protected ableton: Ableton;

  /**
   * Raw chain data from Live
   */
  protected raw: RawChain;

  /**
   * The API path to this chain
   */
  protected path: string;

  /**
   * Creates a new Chain instance.
   * 
   * @param ableton - The Ableton instance
   * @param raw - Raw chain data from Live
   * @param path - The path to this chain in the Live API
   */
  constructor(
    ableton: Ableton,
    raw: RawChain,
    path: string = "",
  ) {
    this.ableton = ableton;
    this.raw = raw;
    this.path = path;
  }

  /**
   * Gets the chain's unique identifier.
   * 
   * @returns The chain ID
   */
  get id(): number {
    return this.raw.id;
  }

  /**
   * Gets the current name of the chain.
   * 
   * @returns Promise resolving to the chain name
   */
  async getName(): Promise<string> {
    return this.ableton.getProp(this.path, undefined, "name");
  }

  /**
   * Sets the name of the chain.
   * 
   * @param name - The new name for the chain
   */
  async setName(name: string): Promise<void> {
    return this.ableton.setProp(this.path, undefined, "name", name);
  }

  /**
   * Gets the current color of the chain.
   * 
   * @returns Promise resolving to the color value
   */
  async getColor(): Promise<number> {
    return this.ableton.getProp(this.path, undefined, "color");
  }

  /**
   * Sets the color of the chain.
   * 
   * @param color - The color value to set
   */
  async setColor(color: number): Promise<void> {
    return this.ableton.setProp(this.path, undefined, "color", color);
  }

  /**
   * Gets the current color index of the chain.
   * 
   * @returns Promise resolving to the color index
   */
  async getColorIndex(): Promise<number> {
    return this.ableton.getProp(this.path, undefined, "color_index");
  }

  /**
   * Sets the color index of the chain.
   * 
   * @param colorIndex - The color index to set
   */
  async setColorIndex(colorIndex: number): Promise<void> {
    return this.ableton.setProp(this.path, undefined, "color_index", colorIndex);
  }

  /**
   * Gets whether the chain is using automatic coloring.
   * 
   * @returns Promise resolving to true if auto-colored
   */
  async getIsAutoColored(): Promise<boolean> {
    return this.ableton.getProp(this.path, undefined, "is_auto_colored");
  }

  /**
   * Sets whether the chain should use automatic coloring.
   * 
   * @param autoColored - True to enable auto-coloring
   */
  async setIsAutoColored(autoColored: boolean): Promise<void> {
    return this.ableton.setProp(this.path, undefined, "is_auto_colored", autoColored);
  }

  /**
   * Gets the mute state of the chain.
   * 
   * @returns Promise resolving to true if the chain is muted
   */
  async getMute(): Promise<boolean> {
    return this.ableton.getProp(this.path, undefined, "mute");
  }

  /**
   * Sets the mute state of the chain.
   * 
   * @param mute - True to mute the chain, false to unmute
   */
  async setMute(mute: boolean): Promise<void> {
    return this.ableton.setProp(this.path, undefined, "mute", mute);
  }

  /**
   * Gets the solo state of the chain.
   * 
   * @returns Promise resolving to true if the chain is soloed
   */
  async getSolo(): Promise<boolean> {
    return this.ableton.getProp(this.path, undefined, "solo");
  }

  /**
   * Sets the solo state of the chain.
   * 
   * @param solo - True to solo the chain, false to unsolo
   */
  async setSolo(solo: boolean): Promise<void> {
    return this.ableton.setProp(this.path, undefined, "solo", solo);
  }

  /**
   * Gets all devices in the chain.
   * 
   * @returns Promise resolving to an array of Device instances
   */
  async getDevices(): Promise<Device[]> {
    const devicesData = await this.ableton.getProp(this.path, undefined, "devices");
    return devicesData.map((deviceData: any) =>
      new Device(this.ableton, deviceData)
    );
  }

  /**
   * Gets a specific device by index.
   * 
   * @param index - The index of the device
   * @returns Promise resolving to a Device instance
   */
  async getDevice(index: number): Promise<Device | null> {
    try {
      const deviceData = await this.ableton.getProp(this.path, undefined, `devices ${index}`);
      return new Device(this.ableton, deviceData);
    } catch (error) {
      return null;
    }
  }

  /**
   * Gets the mixer device for this chain.
   * The mixer device provides access to volume, panning, and send controls.
   * 
   * @returns Promise resolving to a ChainMixerDevice instance
   */
  async getMixerDevice(): Promise<ChainMixerDevice> {
    const mixerData = await this.ableton.getProp(this.path, undefined, "mixer_device");
    return new ChainMixerDevice(this.ableton, mixerData);
  }

  /**
   * Adds a listener for name changes.
   * 
   * @param listener - Callback function to be called when name changes
   */
  addNameListener(listener: () => void): void {
    this.ableton.addListener("name", listener);
  }

  /**
   * Removes a name listener.
   * 
   * @param listener - The listener function to remove
   */
  removeNameListener(listener: () => void): void {
    this.ableton.removeListener("name", listener);
  }

  /**
   * Adds a listener for color changes.
   * 
   * @param listener - Callback function to be called when color changes
   */
  addColorListener(listener: () => void): void {
    this.ableton.addListener("color", listener);
  }

  /**
   * Removes a color listener.
   * 
   * @param listener - The listener function to remove
   */
  removeColorListener(listener: () => void): void {
    this.ableton.removeListener("color", listener);
  }

  /**
   * Adds a listener for color index changes.
   * 
   * @param listener - Callback function to be called when color index changes
   */
  addColorIndexListener(listener: () => void): void {
    this.ableton.addListener("color_index", listener);
  }

  /**
   * Removes a color index listener.
   * 
   * @param listener - The listener function to remove
   */
  removeColorIndexListener(listener: () => void): void {
    this.ableton.removeListener("color_index", listener);
  }

  /**
   * Adds a listener for mute changes.
   * 
   * @param listener - Callback function to be called when mute state changes
   */
  addMuteListener(listener: () => void): void {
    this.ableton.addListener("mute", listener);
  }

  /**
   * Removes a mute listener.
   * 
   * @param listener - The listener function to remove
   */
  removeMuteListener(listener: () => void): void {
    this.ableton.removeListener("mute", listener);
  }

  /**
   * Adds a listener for solo changes.
   * 
   * @param listener - Callback function to be called when solo state changes
   */
  addSoloListener(listener: () => void): void {
    this.ableton.addListener("solo", listener);
  }

  /**
   * Removes a solo listener.
   * 
   * @param listener - The listener function to remove
   */
  removeSoloListener(listener: () => void): void {
    this.ableton.removeListener("solo", listener);
  }

  /**
   * Adds a listener for devices changes.
   * 
   * @param listener - Callback function to be called when devices change
   */
  addDevicesListener(listener: () => void): void {
    this.ableton.addListener("devices", listener);
  }

  /**
   * Removes a devices listener.
   * 
   * @param listener - The listener function to remove
   */
  removeDevicesListener(listener: () => void): void {
    this.ableton.removeListener("devices", listener);
  }

  /**
   * Adds a listener for auto-colored state changes.
   * 
   * @param listener - Callback function to be called when auto-colored state changes
   */
  addIsAutoColoredListener(listener: () => void): void {
    this.ableton.addListener("is_auto_colored", listener);
  }

  /**
   * Removes an auto-colored listener.
   * 
   * @param listener - The listener function to remove
   */
  removeIsAutoColoredListener(listener: () => void): void {
    this.ableton.removeListener("is_auto_colored", listener);
  }

  // TODO not the right way to call this, or not implemented yet

//   /**
//    * Deletes all devices in the chain.
//    */
//   async deleteAllDevices(): Promise<void> {
//     return this.ableton.call(this.path, "delete_device");
//   }

//   /**
//    * Deletes a specific device by index.
//    * 
//    * @param index - The index of the device to delete
//    */
//   async deleteDevice(index: number): Promise<void> {
//     return this.ableton.call(`${this.path} devices ${index}`, "delete_device");
//   }

  /**
   * Converts the chain data to a JSON representation.
   * 
   * @returns Object containing the chain's properties
   */
  toJSON(): Record<string, unknown> {
    return {
      id: this.raw.id,
      name: this.raw.name,
      color: this.raw.color,
      color_index: this.raw.color_index,
      is_auto_colored: this.raw.is_auto_colored,
      mute: this.raw.mute,
      solo: this.raw.solo,
      devices: this.raw.devices,
      mixer_device: this.raw.mixer_device,
    };
  }
}