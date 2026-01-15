import { describe, it, expect, beforeEach } from "vitest";
import { addresses, searchAddresses } from "../../service.ts";


beforeEach(() => {
  addresses.reset();
});

describe("Test service", () => {
  describe("Test searchAddresses", () => {
    it("should match o with ø", () => {
      addresses.addAll([
        {
          "postNumber": 0,
          "city": "test",
          "street": "Røstbakken 1-33, 2-34",
          "typeCode": 0,
          "type": "test",
          "district": "test",
          "municipalityNumber": 0,
          "municipality": "test",
          "county": "test"
        }
      ])
      const result = searchAddresses("Ros");
      expect(result).length(1);
    });

    it("should match oe with ø", () => {
      addresses.addAll([
        {
          "postNumber": 0,
          "city": "TROMSØ",
          "street": "test",
          "typeCode": 0,
          "type": "test",
          "district": "test",
          "municipalityNumber": 0,
          "municipality": "test",
          "county": "test"
        }
      ])
      const result = searchAddresses("Tromsoe");
      expect(result).length(1);
    });
  
    it("should match aa with å", () => {
      addresses.addAll([
        {
          "postNumber": 0,
          "city": "test",
          "street": "Andfiskå",
          "typeCode": 0,
          "type": "test",
          "district": "test",
          "municipalityNumber": 0,
          "municipality": "test",
          "county": "test"
        }
      ])
      const result = searchAddresses("Andfiskaa");
      expect(result).length(1);
    });
    
    it("should limit the number of results to 20 by default", () => {
      const data = Array.from(
        { length: 25 },
        (_, i) => ({
          postNumber: i + 1,
          city: "Oslo",
          street: "test",
          typeCode: 0,
          type: "test",
          district: "test",
          municipalityNumber: 0,
          municipality: "test",
          county: "test"
        })
      );
      
      addresses.addAll(data);
      
      const result_one = searchAddresses("Oslo");
      expect(result_one).length(20);
      
      const result_two = searchAddresses("Oslo", 100);
      expect(result_two).length(25);
    
      const result_three = searchAddresses("Oslo", 10);
      expect(result_three).length(10);
    });
    
    it("should limit the final result not individual query key matches", () => {
      const limit = 5;
      
      const data = Array.from(
        { length: limit },
        (_, i) => ({
          postNumber: i + 1,
          city: "Oslo",
          street: "Postbanken",
          typeCode: 0,
          type: "test",
          district: "test",
          municipalityNumber: 0,
          municipality: "test",
          county: "test"
        })
      );
      
      const num_matching_entries = 3;
      const extra_data = Array.from(
        { length: num_matching_entries },
        (_, i) => ({
          postNumber: i + 1,
          city: "Oslo",
          street: "Aetat - meldekort",
          typeCode: 0,
          type: "test",
          district: "test",
          municipalityNumber: 0,
          municipality: "test",
          county: "test"
        })
      );
      
      addresses.addAll([...data, ...extra_data]);
      
      const result_one = searchAddresses("Oslo Aetat meldekort", limit);
      expect(result_one).length(num_matching_entries);
    });
    
    it("should match only by post number, city and street", () => {
      addresses.addAll([
        {
          "postNumber": 8618,
          "city": "MO I RANA",
          "street": "Andfiskå",
          "typeCode": 0,
          "type": "test",
          "district": "test",
          "municipalityNumber": 0,
          "municipality": "test",
          "county": "test"
        }
      ])
      const result_one = searchAddresses("Andfiskå 8618 MO I RANA");
      expect(result_one).length(1);
      
      const result_two = searchAddresses("test");
      expect(result_two).length(0);
      
      const result_three = searchAddresses("0");
      expect(result_three).length(0);
    });
  });
});