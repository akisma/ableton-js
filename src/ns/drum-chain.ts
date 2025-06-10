import { Ableton } from "../index";
import { Chain, RawChain } from "./chain";

export interface RawDrumChain extends RawChain {
  choke_group: number;
  out_of_key: boolean;
  auto_select_on_receive: boolean;
}

export interface GettableProperties {
  choke_group: number;
  out_of_key: boolean;
  auto_select_on_receive: boolean;
}

export interface TransformableProperties {
    choke_group: number;
    out_of_key: boolean;
    auto_select_on_receive: boolean;
}

/**
 * Represents a drum chain in Ableton Live's Drum Rack device.
 * A DrumChain is a specialized Chain used within Drum Racks that contains
 * devices and can be assigned to specific drum pads.
 */
export class DrumChain extends Chain<
  GettableProperties, 
  TransformableProperties
> 
{
  protected declare raw: RawDrumChain;
  /**
   * Creates a new DrumChain instance.
   * 
   * @param ableton - The Ableton instance
   * @param raw - Raw drum chain data from Live
   * @param path - The path to this drum chain in the Live API
   */
  constructor(
    ableton: Ableton,
    raw: RawDrumChain,
    path: string = "",
  ) {
    super(ableton, raw, path);
  }

  /**
   * Gets the current choke group number for this drum chain.
   * Drum chains in the same choke group will cut each other off when triggered.
   * 
   * @returns Promise resolving to the choke group number (0 = no choke group)
   */
  async getChokeGroup(): Promise<number> {
    return this.ableton.getProp(this.path, undefined, "choke_group");
  }

  /**
   * Sets the choke group for this drum chain.
   * 
   * @param chokeGroup - The choke group number (0 = no choke group)
   */
  async setChokeGroup(chokeGroup: number): Promise<void> {
    return this.ableton.setProp(this.path, undefined, "choke_group", chokeGroup);
  }

  /**
   * Gets whether this drum chain is marked as out of key.
   * Out of key drum chains are typically dimmed in the UI.
   * 
   * @returns Promise resolving to true if the drum chain is out of key
   */
  async getOutOfKey(): Promise<boolean> {
    return this.ableton.getProp(this.path, undefined, "out_of_key");
  }

  /**
   * Sets whether this drum chain is marked as out of key.
   * 
   * @param outOfKey - True to mark as out of key, false otherwise
   */
  async setOutOfKey(outOfKey: boolean): Promise<void> {
    return this.ableton.setProp(this.path, undefined, "out_of_key", outOfKey);
  }

  /**
   * Gets whether this drum chain will auto-select when it receives MIDI.
   * 
   * @returns Promise resolving to true if auto-select is enabled
   */
  async getAutoSelectOnReceive(): Promise<boolean> {
    return this.ableton.getProp(this.path, undefined, "auto_select_on_receive");
  }

  /**
   * Sets whether this drum chain will auto-select when it receives MIDI.
   * 
   * @param autoSelect - True to enable auto-select, false to disable
   */
  async setAutoSelectOnReceive(autoSelect: boolean): Promise<void> {
    return this.ableton.setProp(this.path, undefined, "auto_select_on_receive", autoSelect);
  }

  /**
   * Adds a listener for choke group changes.
   * 
   * @param listener - Callback function to be called when choke group changes
   */
  addChokeGroupListener(listener: () => void): void {
    this.ableton.addListener("choke_group", listener);
  }

  /**
   * Removes a choke group listener.
   * 
   * @param listener - The listener function to remove
   */
  removeChokeGroupListener(listener: () => void): void {
    this.ableton.removeListener("choke_group", listener);
  }

  /**
   * Adds a listener for out of key changes.
   * 
   * @param listener - Callback function to be called when out of key status changes
   */
  addOutOfKeyListener(listener: () => void): void {
    this.ableton.addListener("out_of_key", listener);
  }

  /**
   * Removes an out of key listener.
   * 
   * @param listener - The listener function to remove
   */
  removeOutOfKeyListener(listener: () => void): void {
    this.ableton.removeListener("out_of_key", listener);
  }

  /**
   * Adds a listener for auto select on receive changes.
   * 
   * @param listener - Callback function to be called when auto select setting changes
   */
  addAutoSelectOnReceiveListener(listener: () => void): void {
    this.ableton.addListener("auto_select_on_receive", listener);
  }

  /**
   * Removes an auto select on receive listener.
   * 
   * @param listener - The listener function to remove
   */
  removeAutoSelectOnReceiveListener(listener: () => void): void {
    this.ableton.removeListener("auto_select_on_receive", listener);
  }

  /**
   * Converts the drum chain data to a JSON representation.
   * 
   * @returns Object containing the drum chain's properties
   */
  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      choke_group: this.raw.choke_group,
      out_of_key: this.raw.out_of_key,
      auto_select_on_receive: this.raw.auto_select_on_receive,
    };
  }
}