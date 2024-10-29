import {
  CXXTYPE,
  CXXTerraNode,
  Clazz,
  Enumz,
  MemberFunction,
  MemberVariable,
  SimpleType,
  SimpleTypeKind,
  Struct,
  Variable,
} from "@agoraio-extensions/cxx-parser";
import { ParseResult } from "@agoraio-extensions/terra-core";
import _ from "lodash";
import {
  dartName,
  enumConstantNaming,
  toDartMemberName,
} from "../parsers/dart_syntax_parser";
import {
  getPointerArrayNameMapping,
  isPointerName,
} from "@agoraio-extensions/terra_shared_configs";
import {
  getDartProjectMarkerParserUserData,
  isFlattenParamNodeTypeStruct,
} from "../parsers/dart_project_marker_parser";
import { getDartTypeRemapping } from "../parsers/dart_type_remapping_parser";

export const defaultDartHeader =
  "/// GENERATED BY terra, DO NOT MODIFY BY HAND.";

export const defaultIgnoreForFile =
  "// ignore_for_file: public_member_api_docs, unused_local_variable, unused_import";

export function isCallbackClass(clazzName: string): boolean {
  return new RegExp(
    "(EventHandler|Observer|Provider|Sink|Callback|ObserverBase|EventHandlerEx)$"
  ).test(clazzName);
}

export function isRegisterCallbackFunction(
  memberFunc: MemberFunction
): boolean {
  return new RegExp(
    "^(register)[A-Za-z0-9]*(EventHandler|Observer|Provider)$"
  ).test(memberFunc.name);
}

export function isUnregisterCallbackFunction(
  memberFunc: MemberFunction
): boolean {
  return new RegExp(
    "^(unregister)[A-Za-z0-9]*(EventHandler|Observer|Provider)$"
  ).test(memberFunc.name);
}

export function getBaseClasses(
  parseResult: ParseResult,
  clazz: Clazz
): Clazz[] {
  let output: Clazz[] = [];
  clazz.base_clazzs.forEach((it) => {
    let found = parseResult.resolveNodeByName(it);
    if (found) {
      output.push(found! as Clazz);
    }
  });

  return output;
}

export function getBaseClassMethods(
  parseResult: ParseResult,
  clazz: Clazz
): MemberFunction[] {
  return clazz.base_clazzs
    .map((it) => {
      return parseResult.resolveNodeByName(it);
    })
    .filter((it) => it?.__TYPE == CXXTYPE.Clazz)
    .map((it) => {
      return it?.asClazz().methods ?? [];
    })
    .flat();
}

export function isNullableType(type: SimpleType): boolean {
  const cppTypeToNullableTypes = ["agora_refptr", "Optional"];

  let isNullableType =
    cppTypeToNullableTypes.find((it) => type.source.includes(it)) != undefined;

  return isNullableType;
}

export function isNullableVariable(variable: Variable): boolean {
  return (
    variable.default_value == "__null" || variable.default_value == "nullptr"
  );
}

export function isNullableValue(value: String): boolean {
  return value == "__null" || value == "nullptr" || value == "NULL";
}

export function setUserdata(node: any, key: string, value: any) {
  node.user_data ??= {};
  let old = node.user_data![key];
  if (old) {
    node.user_data![key] = _.merge(old, value);
  } else {
    node.user_data![key] = value;
  }
}

const ignoreJsonTypes = ["Uint8List"];
export function isNeedIgnoreJsonInJsonObject(
  parseResult: ParseResult,
  type: SimpleType
): boolean {
  let isIgnoreJson = ignoreJsonTypes.includes(dartName(type));

  return isIgnoreJson;
}

export function isDartBufferType(type: SimpleType): boolean {
  return dartName(type) == "Uint8List";
}

export function _trim(
  str: string,
  options?: { eliminateEmptyLine?: boolean }
): string {
  let eliminateEmptyLine = options?.eliminateEmptyLine ?? false;
  if (eliminateEmptyLine) {
    return str
      .split("\n")
      .filter((it) => it.trim().length != 0)
      .join("\n")
      .trim();
  }

  return str.trim();
}

export function enumConstantDefaultValue(
  enumz: Enumz,
  defaultValue: string
): string {
  let enumValue = enumz.enum_constants.find(
    (it) => it.name == defaultValue.trimNamespace()
  );
  if (enumValue) {
    return `${dartName(enumz)}.${enumConstantNaming(enumz, enumValue)}`;
  }
  return defaultValue;
}

export interface _ParameterDeclarationHolder {
  type: string;
  name: string;
  defaultValue: string;
}

export function toParameterDeclaration(
  parseResult: ParseResult,
  param: CXXTerraNode,
  type: SimpleType,
  defaultValue: string
): _ParameterDeclarationHolder {
  let typeNode = parseResult.resolveNodeByType(type);
  let typeName =
    getDartTypeRemapping(param)?.config?.dartType ?? dartName(type);
  let displayNameConfig =
    getDartProjectMarkerParserUserData(param)?.displayNameConfig;
  let variableName = displayNameConfig?.displayName ?? dartName(param);
  let returnDefaultValue = defaultValue;

  // Has default value
  if (defaultValue.length > 0) {
    if (typeNode.__TYPE == CXXTYPE.Enumz) {
      returnDefaultValue = `${enumConstantDefaultValue(
        typeNode.asEnumz(),
        defaultValue
      )}`;
    } else if (typeNode.__TYPE == CXXTYPE.Struct) {
      returnDefaultValue = defaultValue;
    } else {
      returnDefaultValue = toDartMemberName(defaultValue);
    }

    if (isNullableValue(defaultValue)) {
      typeName = `${typeName}?`;
      returnDefaultValue = "";
    }
  } else {
    typeName = `${typeName}?`;
    returnDefaultValue = "";
  }

  return {
    type: typeName,
    name: variableName,
    defaultValue: returnDefaultValue,
  };
}

export function renderJsonSerializable(
  parseResult: ParseResult,
  jsonClassName: string,
  memberVariables: MemberVariable[],
  options?: {
    forceExplicitNullableType?: boolean;
    forceNamingConstructor?: boolean;
    parentNode?: CXXTerraNode;
  }
) {
  let forceExplicitNullableType: boolean =
    options?.forceExplicitNullableType ?? true;
  let forceNamingConstructor: boolean = options?.forceNamingConstructor ?? true;
  let parentNode = options?.parentNode;

  let newMemberVariables = memberVariables
    .filter((it) => {
      return getDartProjectMarkerParserUserData(it)?.isHiddenNode != true;
    })
    .filter((it) => {
      let shouldInclude = true;
      if (parentNode) {
        let isFlattenNode = isFlattenParamNodeTypeStruct(
          parseResult,
          parentNode
        );
        if (!isFlattenNode) {
          if (parentNode.isStruct()) {
            // let struct = parentNode.asStruct();
            shouldInclude = filterPointerArrayLengthNames(
              parentNode.asStruct(),
              it
            );
          }

          if (parentNode.isMemberFunction()) {
            shouldInclude = filterPointerArrayLengthNames(
              parentNode.asMemberFunction(),
              it
            );
          }
        }
      }

      return shouldInclude;
    });

  let memberVariableDefaultValues = new Map<string, string>();
  if (parentNode) {
    if (parentNode.isStruct()) {
      parentNode.asStruct().constructors.forEach((constructor) => {
        constructor.initializerList.forEach((initializer) => {
          if (initializer.kind == "Value") {
            memberVariableDefaultValues.set(
              initializer.name,
              initializer.values[0]
            );
          }
        });
      });
    }
  }

  let initializeBlock = "";
  if (newMemberVariables.length > 0) {
    initializeBlock = newMemberVariables
      .map((it) => {
        let code = `this.${dartName(it)}`;

        let param = toParameterDeclaration(
          parseResult,
          it,
          it.type,
          memberVariableDefaultValues.get(it.name) ?? ""
        );

        let defaultValue = param.defaultValue;
        let displayNameConfig =
          getDartProjectMarkerParserUserData(it)?.displayNameConfig;
        let defaultValueBuilder =
          displayNameConfig?.converter?.defaultValueBuilder;
        if (defaultValueBuilder) {
          defaultValue = defaultValueBuilder(
            parseResult,
            displayNameConfig!,
            param.defaultValue
          );
        }

        if (defaultValue.length > 0) {
          code += ` = ${defaultValue}`;
        }

        return code;
      })
      .join(",");
  }

  if (forceNamingConstructor && initializeBlock.length) {
    initializeBlock = `{${initializeBlock}}`;
  }

  let output = `
  @JsonSerializable(explicitToJson: true, includeIfNull: false)
  class ${jsonClassName} {
    const ${jsonClassName}(
      ${initializeBlock}
    );

    ${newMemberVariables
      .map((it) => {
        let isIgnoreJson = isNeedIgnoreJsonInJsonObject(parseResult, it.type);
        let isNeedReadValueWithReadIntPtr =
          !isIgnoreJson && isUIntPtr(parseResult, it.type);
        let isNeedReadValueWithReadIntPtrList =
          !isIgnoreJson && isUIntPtrList(parseResult, it.type);
        let actualNode = parseResult.resolveNodeByType(it.type);
        // Campatible with the old code.
        isIgnoreJson =
          isIgnoreJson || dartName(actualNode) == "RtmEventHandler";
        // TODO(littlegnal): Add converter annotation for class type.
        // We should add converter annotation for class type, but we only add it for VideoFrameMetaInfo
        // due to the historical reason.
        let isClazz = actualNode.__TYPE == CXXTYPE.Clazz;
        let jsonConverter = "";
        let dartProjectMarkerParserUserData =
          getDartProjectMarkerParserUserData(it);
        if (dartProjectMarkerParserUserData) {
          jsonConverter =
            dartProjectMarkerParserUserData.jsonConverter?.jsonConverter ?? "";
        }

        let nullableSurffix = forceExplicitNullableType ? "?" : "";
        let jsonKeyAnnotations = [
          `name: '${it.name}'`,
          ...(isIgnoreJson ? ["ignore: true"] : []),
          ...(isNeedReadValueWithReadIntPtr &&
          !isNeedReadValueWithReadIntPtrList
            ? ["readValue: readIntPtr"]
            : []),
          ...(isNeedReadValueWithReadIntPtr && isNeedReadValueWithReadIntPtrList
            ? ["readValue: readIntPtrList"]
            : []),
        ];

        let dartType = dartName(it.type);

        let displayNameConfig =
          getDartProjectMarkerParserUserData(it)?.displayNameConfig;
        if (displayNameConfig && displayNameConfig.displayType) {
          dartType = displayNameConfig.displayType;
        }
        dartType = `${dartType}${nullableSurffix}`;

        return `
      ${isClazz ? `@${dartName(actualNode)}Converter()` : jsonConverter}
      @JsonKey(${jsonKeyAnnotations.join(",")})
      final ${dartType} ${dartName(it)};
      `.trim();
      })
      .join("\n\n")}

    factory ${jsonClassName}.fromJson(Map<String, dynamic> json) => _$${jsonClassName}FromJson(json);

    Map<String, dynamic> toJson() => _$${jsonClassName}ToJson(this);
  }
  `;

  return output;
}

export function renderEnumJsonSerializable(enumz: Enumz) {
  let enumName = dartName(enumz);
  return `
@JsonEnum(alwaysCreate: true)
enum ${enumName} {
  ${enumz.enum_constants
    .map((it) => {
      return `
    @JsonValue(${it.value})
    ${dartName(it)},
    `;
    })
    .join("\n\n")}
}

extension ${enumName}Ext on ${enumName} {
  /// @nodoc
  static ${enumName} fromValue(int value) {
    return $enumDecode(_$${enumName}EnumMap, value);
  }

  /// @nodoc
  int value() {
    return _$${enumName}EnumMap[this]!;
  }
}
`;
}

export function renderTopLevelVariable(topLevelVariable: Variable): string {
  const unsignedIntMaxExpression = "(std::numeric_limits<unsigned int>::max)()";
  let dartConst = "";
  dartConst += "/// @nodoc \n";
  let defaultValue = topLevelVariable.default_value;
  if (defaultValue === unsignedIntMaxExpression) {
    // value of `(std::numeric_limits<unsigned int>::max)()`
    defaultValue = "4294967295";
  }
  dartConst += `const ${dartName(topLevelVariable)} = ${defaultValue};\n`;
  return dartConst;
}

export function variableToMemberVariable(it: Variable): MemberVariable {
  return {
    name: it.name,
    type: it.type,
    user_data: it.user_data,
  } as MemberVariable;
}

const stdIntTypes = [
  "int8_t",
  "int16_t",
  "int32_t",
  "int64_t",
  "uint8_t",
  "uint16_t",
  "uint32_t",
  "uint64_t",
  "size_t",
];

// TODO(littlegnal): Move to cxx-parser
export function isStdIntType(typeName: string): boolean {
  return stdIntTypes.includes(typeName);
}

function isBufferPtr(type: SimpleType): boolean {
  return (
    type.kind == SimpleTypeKind.pointer_t &&
    (isStdIntType(type.name) ||
      type.source.includes("unsigned char") ||
      type.name.toLowerCase().includes("buffer") ||
      type.source.includes("void"))
  );
}

export function isUIntPtr(parseResult: ParseResult, type: SimpleType): boolean {
  let isUIntPtr = isBufferPtr(type);
  if (!isUIntPtr) {
    let actualNode = parseResult.resolveNodeByType(type);
    if (actualNode.__TYPE == CXXTYPE.TypeAlias) {
      isUIntPtr = isBufferPtr(actualNode.asTypeAlias().underlyingType);
    }
  }

  return isUIntPtr;
}

export function isUIntPtrList(
  parseResult: ParseResult,
  type: SimpleType
): boolean {
  let isPtrList = isUIntPtr(parseResult, type);
  isPtrList = isPtrList && type.kind == SimpleTypeKind.array_t;
  return isPtrList;
}

function getPointerArrayLengthNameMapping(
  name: string,
  self: Struct | MemberFunction
): readonly [string, string] | undefined {
  function _match(
    name: string,
    self: Struct | MemberFunction
  ): string | undefined {
    let ptName = name;
    let regex = new RegExp(ptName + "(Size|Count|Length)");
    if (self.isStruct()) {
      return self.asStruct().member_variables.find((it) => {
        return regex.test(it.name);
      })?.name;
    }

    return self.asMemberFunction().parameters.find((it) => {
      return regex.test(it.name);
    })?.name;
  }

  // Check if config in `PointerArrayMarkerParser`
  let fromParser = getPointerArrayNameMapping(name, self);
  if (fromParser) {
    return fromParser;
  }

  // A pointer name should not be a pointer array length name
  if (isPointerName(name, self)) {
    return undefined;
  }

  let ptName = _match(name, self);

  if (!ptName) {
    ptName = name.replace(new RegExp("(s|List)$"), "");
    ptName = _match(ptName, self);
  }

  if (!ptName) {
    return undefined;
  }

  return [name, ptName];
}

export function getPointerArrayLengthNameMappings(
  self: Struct | MemberFunction
): Map<string, string> | undefined {
  let mapping = new Map<string, string>();
  if (self.isStruct()) {
    self.asStruct().member_variables.forEach((it) => {
      let ptName = getPointerArrayLengthNameMapping(it.name, self);
      if (ptName) {
        mapping.set(ptName[0], ptName[1]);
      }
    });
  }
  if (self.isMemberFunction()) {
    self.asMemberFunction().parameters.forEach((it) => {
      let ptName = getPointerArrayLengthNameMapping(it.name, self);
      if (ptName) {
        mapping.set(ptName[0], ptName[1]);
      }
    });
  }

  return mapping;
}

export function filterPointerArrayLengthNames(
  node: Struct | MemberFunction,
  parameter: MemberVariable | Variable
): boolean {
  let mappings = getPointerArrayLengthNameMappings(node);
  // parameter
  return (
    Array.from(mappings?.values() ?? []).find((it) => it == parameter.name) ==
    undefined
  );
  // return false;
}