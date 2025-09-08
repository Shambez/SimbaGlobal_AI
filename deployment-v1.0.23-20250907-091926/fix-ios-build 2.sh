#!/bin/bash

echo "🔧 SimbaGlobal AI - iOS Build Fix Script"
echo "======================================="

# Set strict error handling
set -e

# Get the project name from app.json
PROJECT_NAME="SimbaGlobalAI"
WORKSPACE_NAME="${PROJECT_NAME}.xcworkspace"

echo "📱 Configuring iOS build for: $PROJECT_NAME"

# Create ios directory if it doesn't exist
if [ ! -d "ios" ]; then
    echo "📁 Creating ios directory..."
    mkdir -p ios
fi

cd ios

# Create the workspace directory structure
echo "🔨 Creating workspace structure..."
mkdir -p "${WORKSPACE_NAME}/xcshareddata"

# Create workspace contents file
cat > "${WORKSPACE_NAME}/contents.xcworkspacedata" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<Workspace
   version = "1.0">
   <FileRef
      location = "group:SimbaGlobalAI.xcodeproj">
   </FileRef>
   <FileRef
      location = "group:Pods/Pods.xcodeproj">
   </FileRef>
</Workspace>
EOF

echo "✅ Created workspace contents"

# Create xcodeproj if it doesn't exist (copy from backup)
if [ ! -d "${PROJECT_NAME}.xcodeproj" ]; then
    echo "📦 Setting up Xcode project..."
    if [ -d "../temp_backup/SimbaGlobal_AI.xcodeproj" ]; then
        cp -r "../temp_backup/SimbaGlobal_AI.xcodeproj" "${PROJECT_NAME}.xcodeproj"
        echo "✅ Copied Xcode project from backup"
    else
        echo "⚠️  No Xcode project found in backup, creating minimal structure..."
        mkdir -p "${PROJECT_NAME}.xcodeproj"
        
        # Create basic project.pbxproj
        cat > "${PROJECT_NAME}.xcodeproj/project.pbxproj" << 'PBXPROJ'
// !$*UTF8*$!
{
	archiveVersion = 1;
	classes = {
	};
	objectVersion = 54;
	objects = {

/* Begin PBXFileReference section */
		13B07F961A680F5B00A75B9A /* SimbaGlobalAI.app */ = {isa = PBXFileReference; explicitFileType = wrapper.application; includeInIndex = 0; path = SimbaGlobalAI.app; sourceTree = BUILT_PRODUCTS_DIR; };
		13B07FAF1A68108700A75B9A /* AppDelegate.h */ = {isa = PBXFileReference; fileEncoding = 4; lastKnownFileType = sourcecode.c.h; name = AppDelegate.h; path = SimbaGlobalAI/AppDelegate.h; sourceTree = "<group>"; };
		13B07FB01A68108700A75B9A /* AppDelegate.mm */ = {isa = PBXFileReference; fileEncoding = 4; lastKnownFileType = sourcecode.cpp.objcpp; name = AppDelegate.mm; path = SimbaGlobalAI/AppDelegate.mm; sourceTree = "<group>"; };
/* End PBXFileReference section */

/* Begin PBXFrameworksBuildPhase section */
		13B07F8C1A680F5B00A75B9A /* Frameworks */ = {
			isa = PBXFrameworksBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXFrameworksBuildPhase section */

/* Begin PBXGroup section */
		13B07FAE1A68108700A75B9A /* SimbaGlobalAI */ = {
			isa = PBXGroup;
			children = (
				13B07FAF1A68108700A75B9A /* AppDelegate.h */,
				13B07FB01A68108700A75B9A /* AppDelegate.mm */,
			);
			name = SimbaGlobalAI;
			sourceTree = "<group>";
		};
		832341AE1AAA6A7D00B99B32 /* Libraries */ = {
			isa = PBXGroup;
			children = (
			);
			name = Libraries;
			sourceTree = "<group>";
		};
		83CBB9F61A601CBA00E9B192 = {
			isa = PBXGroup;
			children = (
				13B07FAE1A68108700A75B9A /* SimbaGlobalAI */,
				832341AE1AAA6A7D00B99B32 /* Libraries */,
				83CBBA001A601CBA00E9B192 /* Products */,
			);
			indentWidth = 2;
			sourceTree = "<group>";
			tabWidth = 2;
			usesTabs = 0;
		};
		83CBBA001A601CBA00E9B192 /* Products */ = {
			isa = PBXGroup;
			children = (
				13B07F961A680F5B00A75B9A /* SimbaGlobalAI.app */,
			);
			name = Products;
			sourceTree = "<group>";
		};
/* End PBXGroup section */

/* Begin PBXNativeTarget section */
		13B07F861A680F5B00A75B9A /* SimbaGlobalAI */ = {
			isa = PBXNativeTarget;
			buildConfigurationList = 13B07F931A680F5B00A75B9A /* Build configuration list for PBXNativeTarget "SimbaGlobalAI" */;
			buildPhases = (
				13B07F871A680F5B00A75B9A /* Sources */,
				13B07F8C1A680F5B00A75B9A /* Frameworks */,
				13B07F8F1A680F5B00A75B9A /* Resources */,
			);
			buildRules = (
			);
			dependencies = (
			);
			name = SimbaGlobalAI;
			productName = SimbaGlobalAI;
			productReference = 13B07F961A680F5B00A75B9A /* SimbaGlobalAI.app */;
			productType = "com.apple.product-type.application";
		};
/* End PBXNativeTarget section */

/* Begin PBXProject section */
		83CBB9F71A601CBA00E9B192 /* Project object */ = {
			isa = PBXProject;
			attributes = {
				LastUpgradeCheck = 1210;
				TargetAttributes = {
					13B07F861A680F5B00A75B9A = {
						LastSwiftMigration = 1120;
					};
				};
			};
			buildConfigurationList = 83CBB9FA1A601CBA00E9B192 /* Build configuration list for PBXProject "SimbaGlobalAI" */;
			compatibilityVersion = "Xcode 12.0";
			developmentRegion = en;
			hasScannedForEncodings = 0;
			knownRegions = (
				en,
				Base,
			);
			mainGroup = 83CBB9F61A601CBA00E9B192;
			productRefGroup = 83CBBA001A601CBA00E9B192 /* Products */;
			projectDirPath = "";
			projectRoot = "";
			targets = (
				13B07F861A680F5B00A75B9A /* SimbaGlobalAI */,
			);
		};
/* End PBXProject section */

/* Begin PBXResourcesBuildPhase section */
		13B07F8F1A680F5B00A75B9A /* Resources */ = {
			isa = PBXResourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXResourcesBuildPhase section */

/* Begin PBXSourcesBuildPhase section */
		13B07F871A680F5B00A75B9A /* Sources */ = {
			isa = PBXSourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
				13B07FB01A68108700A75B9A /* AppDelegate.mm in Sources */,
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXSourcesBuildPhase section */

/* Begin XCBuildConfiguration section */
		13B07F941A680F5B00A75B9A /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				CLANG_ENABLE_MODULES = YES;
				CURRENT_PROJECT_VERSION = 23;
				ENABLE_BITCODE = NO;
				INFOPLIST_FILE = SimbaGlobalAI/Info.plist;
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
				);
				MARKETING_VERSION = 1.0.23;
				OTHER_LDFLAGS = (
					"$(inherited)",
					"-ObjC",
					"-lc++",
				);
				PRODUCT_BUNDLE_IDENTIFIER = "com.shambez.simbaglobalai";
				PRODUCT_NAME = SimbaGlobalAI;
				SWIFT_OPTIMIZATION_LEVEL = "-Onone";
				SWIFT_VERSION = 5.0;
				VERSIONING_SYSTEM = "apple-generic";
			};
			name = Debug;
		};
		13B07F951A680F5B00A75B9A /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				CLANG_ENABLE_MODULES = YES;
				CURRENT_PROJECT_VERSION = 23;
				ENABLE_BITCODE = NO;
				INFOPLIST_FILE = SimbaGlobalAI/Info.plist;
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
				);
				MARKETING_VERSION = 1.0.23;
				OTHER_LDFLAGS = (
					"$(inherited)",
					"-ObjC",
					"-lc++",
				);
				PRODUCT_BUNDLE_IDENTIFIER = "com.shambez.simbaglobalai";
				PRODUCT_NAME = SimbaGlobalAI;
				SWIFT_VERSION = 5.0;
				VERSIONING_SYSTEM = "apple-generic";
			};
			name = Release;
		};
		83CBBA201A601CBA00E9B192 /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				CLANG_ANALYZER_LOCALIZABILITY_NONLOCALIZED = YES;
				CLANG_CXX_LANGUAGE_STANDARD = "c++17";
				CLANG_CXX_LIBRARY = "libc++";
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				CLANG_WARN_BLOCK_CAPTURE_AUTORELEASING = YES;
				CLANG_WARN_BOOL_CONVERSION = YES;
				CLANG_WARN_COMMA = YES;
				CLANG_WARN_CONSTANT_CONVERSION = YES;
				CLANG_WARN_DEPRECATED_OBJC_IMPLEMENTATIONS = YES;
				CLANG_WARN_DIRECT_OBJC_ISA_USAGE = YES_ERROR;
				CLANG_WARN_EMPTY_BODY = YES;
				CLANG_WARN_ENUM_CONVERSION = YES;
				CLANG_WARN_INFINITE_RECURSION = YES;
				CLANG_WARN_INT_CONVERSION = YES;
				CLANG_WARN_NON_LITERAL_NULL_CONVERSION = YES;
				CLANG_WARN_OBJC_IMPLICIT_RETAIN_SELF = YES;
				CLANG_WARN_OBJC_LITERAL_CONVERSION = YES;
				CLANG_WARN_OBJC_ROOT_CLASS = YES_ERROR;
				CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER = YES;
				CLANG_WARN_RANGE_LOOP_ANALYSIS = YES;
				CLANG_WARN_STRICT_PROTOTYPES = YES;
				CLANG_WARN_SUSPICIOUS_MOVE = YES;
				CLANG_WARN_UNREACHABLE_CODE = YES;
				CLANG_WARN__DUPLICATE_METHOD_MATCH = YES;
				"CODE_SIGN_IDENTITY[sdk=iphoneos*]" = "iPhone Developer";
				COPY_PHASE_STRIP = NO;
				DEBUG_INFORMATION_FORMAT = dwarf;
				ENABLE_STRICT_OBJC_MSGSEND = YES;
				ENABLE_TESTABILITY = YES;
				"EXCLUDED_ARCHS[sdk=iphonesimulator*]" = "";
				GCC_C_LANGUAGE_STANDARD = gnu99;
				GCC_DYNAMIC_NO_PIC = NO;
				GCC_NO_COMMON_BLOCKS = YES;
				GCC_OPTIMIZATION_LEVEL = 0;
				GCC_PREPROCESSOR_DEFINITIONS = (
					"DEBUG=1",
					"$(inherited)",
				);
				GCC_SYMBOLS_PRIVATE_EXTERN = NO;
				GCC_WARN_64_TO_32_BIT_CONVERSION = YES;
				GCC_WARN_ABOUT_RETURN_TYPE = YES_ERROR;
				GCC_WARN_UNDECLARED_SELECTOR = YES;
				GCC_WARN_UNINITIALIZED_AUTOS = YES_AGGRESSIVE;
				GCC_WARN_UNUSED_FUNCTION = YES;
				GCC_WARN_UNUSED_VARIABLE = YES;
				IPHONEOS_DEPLOYMENT_TARGET = 13.4;
				LD_RUNPATH_SEARCH_PATHS = (
					"/usr/lib/swift",
					"$(inherited)",
				);
				LIBRARY_SEARCH_PATHS = (
					"\"$(SDKROOT)/usr/lib/swift\"",
					"\"$(TOOLCHAIN_DIR)/usr/lib/swift/$(PLATFORM_NAME)\"",
					"\"$(inherited)\"",
				);
				MTL_ENABLE_DEBUG_INFO = YES;
				ONLY_ACTIVE_ARCH = YES;
				OTHER_CPLUSPLUSFLAGS = (
					"$(OTHER_CFLAGS)",
					"-DFOLLY_NO_CONFIG",
					"-DFOLLY_MOBILE=1",
					"-DFOLLY_USE_LIBCPP=1",
					"-DFOLLY_CFG_NO_COROUTINES=1",
					"-DFOLLY_DISABLE_LIBUNWIND=1",
				);
				SDKROOT = iphoneos;
			};
			name = Debug;
		};
		83CBBA211A601CBA00E9B192 /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				CLANG_ANALYZER_LOCALIZABILITY_NONLOCALIZED = YES;
				CLANG_CXX_LANGUAGE_STANDARD = "c++17";
				CLANG_CXX_LIBRARY = "libc++";
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				CLANG_WARN_BLOCK_CAPTURE_AUTORELEASING = YES;
				CLANG_WARN_BOOL_CONVERSION = YES;
				CLANG_WARN_COMMA = YES;
				CLANG_WARN_CONSTANT_CONVERSION = YES;
				CLANG_WARN_DEPRECATED_OBJC_IMPLEMENTATIONS = YES;
				CLANG_WARN_DIRECT_OBJC_ISA_USAGE = YES_ERROR;
				CLANG_WARN_EMPTY_BODY = YES;
				CLANG_WARN_ENUM_CONVERSION = YES;
				CLANG_WARN_INFINITE_RECURSION = YES;
				CLANG_WARN_INT_CONVERSION = YES;
				CLANG_WARN_NON_LITERAL_NULL_CONVERSION = YES;
				CLANG_WARN_OBJC_IMPLICIT_RETAIN_SELF = YES;
				CLANG_WARN_OBJC_LITERAL_CONVERSION = YES;
				CLANG_WARN_OBJC_ROOT_CLASS = YES_ERROR;
				CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER = YES;
				CLANG_WARN_RANGE_LOOP_ANALYSIS = YES;
				CLANG_WARN_STRICT_PROTOTYPES = YES;
				CLANG_WARN_SUSPICIOUS_MOVE = YES;
				CLANG_WARN_UNREACHABLE_CODE = YES;
				CLANG_WARN__DUPLICATE_METHOD_MATCH = YES;
				"CODE_SIGN_IDENTITY[sdk=iphoneos*]" = "iPhone Developer";
				COPY_PHASE_STRIP = YES;
				DEBUG_INFORMATION_FORMAT = "dwarf-with-dsym";
				ENABLE_NS_ASSERTIONS = NO;
				ENABLE_STRICT_OBJC_MSGSEND = YES;
				"EXCLUDED_ARCHS[sdk=iphonesimulator*]" = "";
				GCC_C_LANGUAGE_STANDARD = gnu99;
				GCC_NO_COMMON_BLOCKS = YES;
				GCC_WARN_64_TO_32_BIT_CONVERSION = YES;
				GCC_WARN_ABOUT_RETURN_TYPE = YES_ERROR;
				GCC_WARN_UNDECLARED_SELECTOR = YES;
				GCC_WARN_UNINITIALIZED_AUTOS = YES_AGGRESSIVE;
				GCC_WARN_UNUSED_FUNCTION = YES;
				GCC_WARN_UNUSED_VARIABLE = YES;
				IPHONEOS_DEPLOYMENT_TARGET = 13.4;
				LD_RUNPATH_SEARCH_PATHS = (
					"/usr/lib/swift",
					"$(inherited)",
				);
				LIBRARY_SEARCH_PATHS = (
					"\"$(SDKROOT)/usr/lib/swift\"",
					"\"$(TOOLCHAIN_DIR)/usr/lib/swift/$(PLATFORM_NAME)\"",
					"\"$(inherited)\"",
				);
				MTL_ENABLE_DEBUG_INFO = NO;
				OTHER_CPLUSPLUSFLAGS = (
					"$(OTHER_CFLAGS)",
					"-DFOLLY_NO_CONFIG",
					"-DFOLLY_MOBILE=1",
					"-DFOLLY_USE_LIBCPP=1",
					"-DFOLLY_CFG_NO_COROUTINES=1",
					"-DFOLLY_DISABLE_LIBUNWIND=1",
				);
				SDKROOT = iphoneos;
				VALIDATE_PRODUCT = YES;
			};
			name = Release;
		};
/* End XCBuildConfiguration section */

/* Begin XCConfigurationList section */
		13B07F931A680F5B00A75B9A /* Build configuration list for PBXNativeTarget "SimbaGlobalAI" */ = {
			isa = XCConfigurationList;
			buildConfigurations = (
				13B07F941A680F5B00A75B9A /* Debug */,
				13B07F951A680F5B00A75B9A /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
		83CBB9FA1A601CBA00E9B192 /* Build configuration list for PBXProject "SimbaGlobalAI" */ = {
			isa = XCConfigurationList;
			buildConfigurations = (
				83CBBA201A601CBA00E9B192 /* Debug */,
				83CBBA211A601CBA00E9B192 /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
/* End XCConfigurationList section */
	};
	rootObject = 83CBB9F71A601CBA00E9B192 /* Project object */;
}
PBXPROJ
        echo "✅ Created basic Xcode project"
    fi
fi

# Create basic scheme
mkdir -p "${PROJECT_NAME}.xcodeproj/xcuserdata/$(whoami).xcuserdatad/xcschemes"
cat > "${PROJECT_NAME}.xcodeproj/xcuserdata/$(whoami).xcuserdatad/xcschemes/${PROJECT_NAME}.xcscheme" << 'SCHEME'
<?xml version="1.0" encoding="UTF-8"?>
<Scheme
   LastUpgradeVersion = "1540"
   version = "1.7">
   <BuildAction
      parallelizeBuildables = "YES"
      buildImplicitDependencies = "YES"
      buildArchitectures = "Automatic">
      <BuildActionEntries>
         <BuildActionEntry
            buildForTesting = "YES"
            buildForRunning = "YES"
            buildForProfiling = "YES"
            buildForArchiving = "YES"
            buildForAnalyzing = "YES">
            <BuildableReference
               BuildableIdentifier = "primary"
               BlueprintIdentifier = "13B07F861A680F5B00A75B9A"
               BuildableName = "SimbaGlobalAI.app"
               BlueprintName = "SimbaGlobalAI"
               ReferencedContainer = "container:SimbaGlobalAI.xcodeproj">
            </BuildableReference>
         </BuildActionEntry>
      </BuildActionEntries>
   </BuildAction>
   <TestAction
      buildConfiguration = "Debug"
      selectedDebuggerIdentifier = "Xcode.DebuggerFoundation.Debugger.LLDB"
      selectedLauncherIdentifier = "Xcode.DebuggerFoundation.Launcher.LLDB"
      shouldUseLaunchSchemeArgsEnv = "YES">
      <Testables>
      </Testables>
   </TestAction>
   <LaunchAction
      buildConfiguration = "Debug"
      selectedDebuggerIdentifier = "Xcode.DebuggerFoundation.Debugger.LLDB"
      selectedLauncherIdentifier = "Xcode.DebuggerFoundation.Launcher.LLDB"
      launchStyle = "0"
      useCustomWorkingDirectory = "NO"
      ignoresPersistentStateOnLaunch = "NO"
      debugDocumentVersioning = "YES"
      debugServiceExtension = "internal"
      allowLocationSimulation = "YES">
      <BuildableProductRunnable
         runnableDebuggingMode = "0">
         <BuildableReference
            BuildableIdentifier = "primary"
            BlueprintIdentifier = "13B07F861A680F5B00A75B9A"
            BuildableName = "SimbaGlobalAI.app"
            BlueprintName = "SimbaGlobalAI"
            ReferencedContainer = "container:SimbaGlobalAI.xcodeproj">
         </BuildableReference>
      </BuildableProductRunnable>
   </LaunchAction>
   <ProfileAction
      buildConfiguration = "Release"
      shouldUseLaunchSchemeArgsEnv = "YES"
      savedToolIdentifier = ""
      useCustomWorkingDirectory = "NO"
      debugDocumentVersioning = "YES">
      <BuildableProductRunnable
         runnableDebuggingMode = "0">
         <BuildableReference
            BuildableIdentifier = "primary"
            BlueprintIdentifier = "13B07F861A680F5B00A75B9A"
            BuildableName = "SimbaGlobalAI.app"
            BlueprintName = "SimbaGlobalAI"
            ReferencedContainer = "container:SimbaGlobalAI.xcodeproj">
         </BuildableReference>
      </BuildableProductRunnable>
   </ProfileAction>
   <AnalyzeAction
      buildConfiguration = "Debug">
   </AnalyzeAction>
   <ArchiveAction
      buildConfiguration = "Release"
      revealArchiveInOrganizer = "YES">
   </AnalyzeAction>
</Scheme>
SCHEME

echo "✅ Created Xcode scheme"

# Create Podfile for CocoaPods
cat > "Podfile" << 'PODFILE'
# Resolve react_native_pods.rb with node to allow for hoisting
require File.join(File.dirname(`node --print "require.resolve('expo/package.json')"`), "scripts/autolinking")
require File.join(File.dirname(`node --print "require.resolve('react-native/package.json')"`), "scripts/react_native_pods")

require 'json'
podfile_properties = {}

platform :ios, podfile_properties['ios.deploymentTarget'] || '13.4'
install! 'cocoapods',
  :deterministic_uuids => false

target 'SimbaGlobalAI' do
  use_expo_modules!
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => podfile_properties['expo.jsEngine'] == 'hermes',
    :fabric_enabled => false,
    :flipper_configuration => false,
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false
    )
  end
end
PODFILE

echo "✅ Created Podfile"

cd ..

echo ""
echo "🎉 iOS Build Configuration Complete!"
echo ""
echo "📋 Created/Updated:"
echo "   • ios/SimbaGlobalAI.xcworkspace - Workspace for Xcode Cloud"
echo "   • ios/SimbaGlobalAI.xcodeproj - Xcode project structure"
echo "   • ios/Podfile - CocoaPods dependencies"
echo "   • Build schemes and configurations"
echo ""
echo "🚀 Next Steps:"
echo "   1. Run: cd ios && pod install"
echo "   2. Commit and push changes to trigger new build"
echo "   3. Build should now work with Xcode Cloud"
echo ""
echo "⚡ Build command will work: eas build -p ios --profile testflight --non-interactive"
