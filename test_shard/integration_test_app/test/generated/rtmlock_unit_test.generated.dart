/// GENERATED BY testcase_gen. DO NOT MODIFY BY HAND.

// ignore_for_file: deprecated_member_use,constant_identifier_names,unused_local_variable,unused_import,unnecessary_import

import 'package:agora_rtm/agora_rtm.dart';
import 'package:agora_rtm/src/impl/gen/agora_rtm_lock_impl.dart'
    as agora_rtm_lock_impl;
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'dart:typed_data';

import '../all_mocks.mocks.dart';

void testCases() {
  test(
    'RtmLock.setLock',
    () async {
      final mockRtmLockNativeBinding = MockRtmLockImpl();
      final mockRtmResultHandlerImpl = MockRtmResultHandlerImpl();
      RtmLock rtmLock = agora_rtm_lock_impl.RtmLockImpl(
        mockRtmLockNativeBinding,
        mockRtmResultHandlerImpl,
      );

      const rtmStatus = RtmStatus.success(operation: 'setLock');
      RtmChannelType theSetLockResultChannelType = RtmChannelType.none;
      String theSetLockResultChannelName = "hello";
      String theSetLockResultLockName = "hello";
      SetLockResult theSetLockResult = SetLockResult(
        channelName: theSetLockResultChannelName,
        channelType: theSetLockResultChannelType,
        lockName: theSetLockResultLockName,
      );
      final mockResultHandlerReturnValue = (theSetLockResult, RtmErrorCode.ok);
      final expectedResultHandlerReturnValue = (rtmStatus, theSetLockResult);
      int mockRequestId = 1;
      {
        String channelName = "hello";
        RtmChannelType channelType = RtmChannelType.none;
        String lockName = "hello";
        int ttl = 5;
        when(mockRtmLockNativeBinding.setLock(
          channelName: channelName,
          channelType: channelType,
          lockName: lockName,
          ttl: ttl,
        )).thenAnswer((_) async => mockRequestId);
        when(mockRtmResultHandlerImpl.request(mockRequestId))
            .thenAnswer((_) async => mockResultHandlerReturnValue);
      }

      String channelName = "hello";
      RtmChannelType channelType = RtmChannelType.none;
      String lockName = "hello";
      int ttl = 5;
      final ret = await rtmLock.setLock(
        channelName,
        channelType,
        lockName,
        ttl: ttl,
      );
      expect(ret, expectedResultHandlerReturnValue);
    },
  );

  test(
    'RtmLock.getLocks',
    () async {
      final mockRtmLockNativeBinding = MockRtmLockImpl();
      final mockRtmResultHandlerImpl = MockRtmResultHandlerImpl();
      RtmLock rtmLock = agora_rtm_lock_impl.RtmLockImpl(
        mockRtmLockNativeBinding,
        mockRtmResultHandlerImpl,
      );

      const rtmStatus = RtmStatus.success(operation: 'getLocks');
      RtmChannelType theGetLocksResultChannelType = RtmChannelType.none;
      String theGetLocksResultChannelName = "hello";
      List<LockDetail> theGetLocksResultLockDetailList = [];
      int theGetLocksResultCount = 5;
      GetLocksResult theGetLocksResult = GetLocksResult(
        channelName: theGetLocksResultChannelName,
        channelType: theGetLocksResultChannelType,
        lockDetailList: theGetLocksResultLockDetailList,
        count: theGetLocksResultCount,
      );
      final mockResultHandlerReturnValue = (theGetLocksResult, RtmErrorCode.ok);
      final expectedResultHandlerReturnValue = (rtmStatus, theGetLocksResult);
      int mockRequestId = 1;
      {
        String channelName = "hello";
        RtmChannelType channelType = RtmChannelType.none;
        when(mockRtmLockNativeBinding.getLocks(
          channelName: channelName,
          channelType: channelType,
        )).thenAnswer((_) async => mockRequestId);
        when(mockRtmResultHandlerImpl.request(mockRequestId))
            .thenAnswer((_) async => mockResultHandlerReturnValue);
      }

      String channelName = "hello";
      RtmChannelType channelType = RtmChannelType.none;
      final ret = await rtmLock.getLocks(
        channelName,
        channelType,
      );
      expect(ret, expectedResultHandlerReturnValue);
    },
  );

  test(
    'RtmLock.removeLock',
    () async {
      final mockRtmLockNativeBinding = MockRtmLockImpl();
      final mockRtmResultHandlerImpl = MockRtmResultHandlerImpl();
      RtmLock rtmLock = agora_rtm_lock_impl.RtmLockImpl(
        mockRtmLockNativeBinding,
        mockRtmResultHandlerImpl,
      );

      const rtmStatus = RtmStatus.success(operation: 'removeLock');
      RtmChannelType theRemoveLockResultChannelType = RtmChannelType.none;
      String theRemoveLockResultChannelName = "hello";
      String theRemoveLockResultLockName = "hello";
      RemoveLockResult theRemoveLockResult = RemoveLockResult(
        channelName: theRemoveLockResultChannelName,
        channelType: theRemoveLockResultChannelType,
        lockName: theRemoveLockResultLockName,
      );
      final mockResultHandlerReturnValue =
          (theRemoveLockResult, RtmErrorCode.ok);
      final expectedResultHandlerReturnValue = (rtmStatus, theRemoveLockResult);
      int mockRequestId = 1;
      {
        String channelName = "hello";
        RtmChannelType channelType = RtmChannelType.none;
        String lockName = "hello";
        when(mockRtmLockNativeBinding.removeLock(
          channelName: channelName,
          channelType: channelType,
          lockName: lockName,
        )).thenAnswer((_) async => mockRequestId);
        when(mockRtmResultHandlerImpl.request(mockRequestId))
            .thenAnswer((_) async => mockResultHandlerReturnValue);
      }

      String channelName = "hello";
      RtmChannelType channelType = RtmChannelType.none;
      String lockName = "hello";
      final ret = await rtmLock.removeLock(
        channelName,
        channelType,
        lockName,
      );
      expect(ret, expectedResultHandlerReturnValue);
    },
  );

  test(
    'RtmLock.acquireLock',
    () async {
      final mockRtmLockNativeBinding = MockRtmLockImpl();
      final mockRtmResultHandlerImpl = MockRtmResultHandlerImpl();
      RtmLock rtmLock = agora_rtm_lock_impl.RtmLockImpl(
        mockRtmLockNativeBinding,
        mockRtmResultHandlerImpl,
      );

      const rtmStatus = RtmStatus.success(operation: 'acquireLock');
      RtmChannelType theAcquireLockResultChannelType = RtmChannelType.none;
      String theAcquireLockResultChannelName = "hello";
      String theAcquireLockResultLockName = "hello";
      String theAcquireLockResultErrorDetails = "hello";
      AcquireLockResult theAcquireLockResult = AcquireLockResult(
        channelName: theAcquireLockResultChannelName,
        channelType: theAcquireLockResultChannelType,
        lockName: theAcquireLockResultLockName,
        errorDetails: theAcquireLockResultErrorDetails,
      );
      final mockResultHandlerReturnValue =
          (theAcquireLockResult, RtmErrorCode.ok);
      final expectedResultHandlerReturnValue =
          (rtmStatus, theAcquireLockResult);
      int mockRequestId = 1;
      {
        String channelName = "hello";
        RtmChannelType channelType = RtmChannelType.none;
        String lockName = "hello";
        bool retry = true;
        when(mockRtmLockNativeBinding.acquireLock(
          channelName: channelName,
          channelType: channelType,
          lockName: lockName,
          retry: retry,
        )).thenAnswer((_) async => mockRequestId);
        when(mockRtmResultHandlerImpl.request(mockRequestId))
            .thenAnswer((_) async => mockResultHandlerReturnValue);
      }

      String channelName = "hello";
      RtmChannelType channelType = RtmChannelType.none;
      String lockName = "hello";
      bool retry = true;
      final ret = await rtmLock.acquireLock(
        channelName,
        channelType,
        lockName,
        retry: retry,
      );
      expect(ret, expectedResultHandlerReturnValue);
    },
  );

  test(
    'RtmLock.releaseLock',
    () async {
      final mockRtmLockNativeBinding = MockRtmLockImpl();
      final mockRtmResultHandlerImpl = MockRtmResultHandlerImpl();
      RtmLock rtmLock = agora_rtm_lock_impl.RtmLockImpl(
        mockRtmLockNativeBinding,
        mockRtmResultHandlerImpl,
      );

      const rtmStatus = RtmStatus.success(operation: 'releaseLock');
      RtmChannelType theReleaseLockResultChannelType = RtmChannelType.none;
      String theReleaseLockResultChannelName = "hello";
      String theReleaseLockResultLockName = "hello";
      ReleaseLockResult theReleaseLockResult = ReleaseLockResult(
        channelName: theReleaseLockResultChannelName,
        channelType: theReleaseLockResultChannelType,
        lockName: theReleaseLockResultLockName,
      );
      final mockResultHandlerReturnValue =
          (theReleaseLockResult, RtmErrorCode.ok);
      final expectedResultHandlerReturnValue =
          (rtmStatus, theReleaseLockResult);
      int mockRequestId = 1;
      {
        String channelName = "hello";
        RtmChannelType channelType = RtmChannelType.none;
        String lockName = "hello";
        when(mockRtmLockNativeBinding.releaseLock(
          channelName: channelName,
          channelType: channelType,
          lockName: lockName,
        )).thenAnswer((_) async => mockRequestId);
        when(mockRtmResultHandlerImpl.request(mockRequestId))
            .thenAnswer((_) async => mockResultHandlerReturnValue);
      }

      String channelName = "hello";
      RtmChannelType channelType = RtmChannelType.none;
      String lockName = "hello";
      final ret = await rtmLock.releaseLock(
        channelName,
        channelType,
        lockName,
      );
      expect(ret, expectedResultHandlerReturnValue);
    },
  );

  test(
    'RtmLock.revokeLock',
    () async {
      final mockRtmLockNativeBinding = MockRtmLockImpl();
      final mockRtmResultHandlerImpl = MockRtmResultHandlerImpl();
      RtmLock rtmLock = agora_rtm_lock_impl.RtmLockImpl(
        mockRtmLockNativeBinding,
        mockRtmResultHandlerImpl,
      );

      const rtmStatus = RtmStatus.success(operation: 'revokeLock');
      RtmChannelType theRevokeLockResultChannelType = RtmChannelType.none;
      String theRevokeLockResultChannelName = "hello";
      String theRevokeLockResultLockName = "hello";
      RevokeLockResult theRevokeLockResult = RevokeLockResult(
        channelName: theRevokeLockResultChannelName,
        channelType: theRevokeLockResultChannelType,
        lockName: theRevokeLockResultLockName,
      );
      final mockResultHandlerReturnValue =
          (theRevokeLockResult, RtmErrorCode.ok);
      final expectedResultHandlerReturnValue = (rtmStatus, theRevokeLockResult);
      int mockRequestId = 1;
      {
        String channelName = "hello";
        RtmChannelType channelType = RtmChannelType.none;
        String lockName = "hello";
        String owner = "hello";
        when(mockRtmLockNativeBinding.revokeLock(
          channelName: channelName,
          channelType: channelType,
          lockName: lockName,
          owner: owner,
        )).thenAnswer((_) async => mockRequestId);
        when(mockRtmResultHandlerImpl.request(mockRequestId))
            .thenAnswer((_) async => mockResultHandlerReturnValue);
      }

      String channelName = "hello";
      RtmChannelType channelType = RtmChannelType.none;
      String lockName = "hello";
      String owner = "hello";
      final ret = await rtmLock.revokeLock(
        channelName,
        channelType,
        lockName,
        owner,
      );
      expect(ret, expectedResultHandlerReturnValue);
    },
  );
}